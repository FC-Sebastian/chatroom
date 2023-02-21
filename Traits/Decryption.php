<?php

trait Decryption
{
    protected function decrypt($data, $key)
    {
        list($enc, $iv) = explode("::", base64_decode($data),2);
        return openssl_decrypt($enc, "aes-256-cbc", $key, 0, $iv);
    }
}