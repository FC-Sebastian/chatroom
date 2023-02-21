<?php

class CipherAjax extends AjaxBaseController
{
    use Encryption;
    use Decryption;

    protected function executeSqlQuery()
    {
        $data = $this->getRequestParameter("data");
        $process = $this->getRequestParameter("process");
        if ($process === "encrypt"){
            echo $this->encrypt($data, Conf::getParam("key"));
        } elseif ($process === "decrypt") {
            echo $this->decrypt($data,Conf::getParam("key"));
        }
    }
}