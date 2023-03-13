<?php

class Conf
{
    private static $confarray = null;

    public static function getParam($key)
    {
        if (self::$confarray === null) {
            if (!file_exists(__DIR__ . "/../config.json")) {
                exit("Keine config.json gefunden");
            }
            $sConfJson = file_get_contents(__DIR__ . "/../config.json");
            self::$confarray = json_decode($sConfJson,true);
        }
        if (isset(self::$confarray[$key])) {
            return self::$confarray[$key];
        }
        return false;
    }
}