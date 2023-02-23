<?php

class GetConfParamsAjax extends AjaxBaseController
{
    /**
     * echoes json encoded config array
     * @return void
     */
    protected function executeSqlQuery()
    {
        $aConfParams = [
            "url" => Conf::getParam("url"),
            "key" => Conf::getParam("key"),
            "host" => Conf::getParam("dbhost"),
            "user" => Conf::getParam("dbuser"),
            "pass" => Conf::getParam("dbpass"),
            "db" => Conf::getParam("db")
            ];
        echo json_encode($aConfParams);
    }
}