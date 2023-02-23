<?php

trait Encryption
{
    /**
     * encrypts given data using given key
     * @param $data
     * @param $key
     * @return string
     */
    protected function encrypt($data, $key)
    {
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length("aes-256-cbc"));
        $enc = openssl_encrypt($data, "aes-256-cbc", $key, 0,$iv);
        return base64_encode($enc."::".$iv);
    }
}