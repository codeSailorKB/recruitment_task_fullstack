<?php

declare(strict_types=1);

namespace App\Controller;

use App\Services\NBPCurrenciesHandler;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ExchangeRatesController extends AbstractController
{
    /**
     * @param string $date
     * @param NBPCurrenciesHandler $currenciesHandler
     * @return Response
     */
    public function exchangeRatesTableAction(string $date, NBPCurrenciesHandler $currenciesHandler): Response
    {
        return new Response(
            json_encode($currenciesHandler->getFullTable($date)),
            Response::HTTP_OK,
            ['Content-type' => 'application/json']
        );
    }
}
