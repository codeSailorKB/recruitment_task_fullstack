<?php

namespace App\Services;

use DateTime;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class NBPCurrenciesHandler
{
    const NO_DATA = '-';
    const TABLE_A_URL_LAST = 'https://api.nbp.pl/api/exchangerates/tables/a/last/1?format=json';
    const TABLE_A_URL_FROM_DATE = 'https://api.nbp.pl/api/exchangerates/tables/a/%s/?format=json';
    private $currenciesInUse;
    /**
     * @var HttpClientInterface
     */
    private $client;


    /**
     * NBPCurrenciesHandler constructor.
     * @param HttpClientInterface $client
     * @param ParameterBagInterface $params
     */
    public function __construct(HttpClientInterface $client, ParameterBagInterface $params)
    {
        $this->client = $client;
        $this->currenciesInUse = $params->get('app.currencies_in_use');
    }

    /**
     * Method returns list of all currencies for specific date with additional info about current rates
     *
     * @param string|null $date
     * @return array
     */
    public function getFullTable(?string $date): array
    {
        //get last results
        $todayCurrenciesData = $this->getFromAPI(self::TABLE_A_URL_LAST);

        //get results from the specific date
        $date = $this->getLastCurrencyUpdateDate(new DateTime($date));
        $currenciesDataFromDate = $this->getFromAPI(sprintf(self::TABLE_A_URL_FROM_DATE, $date->format('Y-m-d')));

        return $this->buildCurrencyDataTable($todayCurrenciesData, $currenciesDataFromDate);
    }

    /**
     * Method processes results to display only needed currencies sorted by name
     *
     * @param array $currenciesData
     * @return array
     */
    private function formatResults(array $currenciesData): array
    {
        //get list of currencies currently used in the app
        $currencies = array_map(function ($currency) {
            return $currency['code'];
        }, $this->currenciesInUse);

        //clean results from unused currencies
        $cleanArray = array_filter($currenciesData, function ($currency) use ($currencies) {
            return in_array($currency['code'], $currencies);
        });

        //sort results by currency name
        usort($cleanArray, static function ($a, $b) {
            return strnatcasecmp($a['currency'], $b['currency']);
        });

        return $cleanArray;
    }

    /**
     * Method builds table data based on the settings
     *
     * @param array $todayCurrenciesData
     * @param array $currenciesDataFromDate
     * @return array
     */
    private function buildCurrencyDataTable(array $todayCurrenciesData, array $currenciesDataFromDate): array
    {
        foreach ($currenciesDataFromDate as &$currency) {
            //find settings for app
            $currencySettings = $this->getCurrencySettings($currency['code']);
            $currency['sellPrice'] = $currency['buyPrice'] = $currency['sellPriceNow'] = $currency['buyPriceNow'] = self::NO_DATA;

            //add data from today to the structure
            $todaysData = array_values(
                array_filter($todayCurrenciesData, static function ($todayCurrency) use ($currency) {
                    return $currency['code'] === $todayCurrency['code'];
                })
            )[0];

            $currency['midNow'] = $todaysData['mid'];

            // recount rates
            if ($currencySettings) {
                if ($currencySettings['sell']) {
                    $currency['sellPrice'] = $currency['mid'] + $currencySettings['sellDiff'];
                    $currency['sellPriceNow'] = $currency['midNow'] + $currencySettings['sellDiff'];
                }

                if ($currencySettings['buy']) {
                    $currency['buyPrice'] = $currency['mid'] - $currencySettings['buyDiff'];
                    $currency['buyPriceNow'] = $currency['midNow'] - $currencySettings['buyDiff'];
                }
            }
        }

        return $currenciesDataFromDate;
    }

    /**
     * Method processes results to display only needed currencies sorted by name
     *
     * @param string $url
     * @return array
     */
    private function getFromAPI(string $url): array
    {
        $response = $this->client->request('GET', $url);
        $currenciesData = $response->toArray();

        if (!isset($currenciesData[0])) {
            return [];
        }

        return $this->formatResults($currenciesData[0]['rates']);
    }


    /**
     * Method returns currency setting from app settings
     * @param string $currencyCode
     * @return array
     */
    private function getCurrencySettings(string $currencyCode): array
    {
         $settings = array_values(
            array_filter($this->currenciesInUse, static function ($defaultCurrency) use ($currencyCode) {
                return $currencyCode === $defaultCurrency['code'];
            })
        );

        return $settings[0] ?? [];
    }

    /**
     * Method returns date when currency rates were updated
     *
     * @param DateTime $date
     * @return DateTime
     */
    private function getLastCurrencyUpdateDate(DateTime $date): DateTime
    {
        $dayOfWeek = $date->format('w');

        switch ($dayOfWeek) {
            case 0:
                //it's Sunday come back to Friday
                $date->modify('-2 days');
                break;
            case 6:
                //it's Saturday come back to Friday
                $date->modify('-1 days');
                break;
            default:
                //it's a working day do nothing
                break;
        }

        return $date;
    }
}
