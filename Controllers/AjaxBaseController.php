<?php

abstract class AjaxBaseController extends BaseController
{
    public function render()
    {
        $this->executeSqlQuery();
        exit();
    }

    abstract protected function executeSqlQuery();
}