<?php

trait Decryption
{
    /**
     * decrypts given data using given key
     * @param $data
     * @param $key
     * @return false|string
     */
    protected function decrypt($data, $key)
    {
        list($enc, $iv) = explode("::", base64_decode($data),2);
        return openssl_decrypt($enc, "aes-256-cbc", $key, 0, $iv);
    }
}