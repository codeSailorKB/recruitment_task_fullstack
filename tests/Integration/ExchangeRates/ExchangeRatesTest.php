<?php

namespace Integration\ExchangeRates;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ExchangeRatesTest extends WebTestCase
{
    public function testConnectivity(): void
    {
        $client = static::createClient();

        // test e.g. the profile page
        $client->request('GET', '/api/exchange-rates/2023-11-20');
        $this->assertResponseIsSuccessful();
        $response = $client->getResponse();
        $this->assertJson($response->getContent());
    }
}