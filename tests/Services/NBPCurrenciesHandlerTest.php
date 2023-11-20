<?php

namespace Services;

use App\Services\NBPCurrenciesHandler;
use DateTime;
use PHPUnit\Framework\TestCase;

class NBPCurrenciesHandlerTest extends TestCase
{
    public function testGetFullTableReturnsArray()
    {
        $date = new DateTime();
        $handler = $this->createMock(NBPCurrenciesHandler::class);
        $result = $handler->getFullTable($date->format('Y-m-d'));

        $this->assertIsArray($result);
    }
}
