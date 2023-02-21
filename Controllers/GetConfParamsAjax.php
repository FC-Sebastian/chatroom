<?php

class GetConfParamsAjax extends AjaxBaseController
{
    protected function executeSqlQuery()
    {
        $confParams = [
            "url" => Conf::getParam("url"),
            "key" => Conf::getParam("key"),
            "host" => Conf::getParam("dbhost"),
            "user" => Conf::getParam("dbuser"),
            "pass" => Conf::getParam("dbpass"),
            "db" => Conf::getParam("db")
            ];
        echo json_encode($confParams);
    }
}