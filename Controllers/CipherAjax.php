<?php

class CipherAjax extends AjaxBaseController
{
    use Encryption;
    use Decryption;

    /**
     * uses the process to determine whether to decrypt or encrypt data then echoes the result
     * @return void
     */
    protected function executeSqlQuery()
    {
        $sData = $this->getRequestParameter("data");
        $sProcess = $this->getRequestParameter("process");
        if ($sProcess === "encrypt"){
            echo $this->encrypt($sData, Conf::getParam("key"));
        } elseif ($sProcess === "decrypt") {
            echo $this->decrypt($sData,Conf::getParam("key"));
        }
    }
}