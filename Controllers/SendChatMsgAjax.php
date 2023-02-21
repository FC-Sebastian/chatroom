<?php

class SendChatMsgAjax extends AjaxBaseController
{
    use Encryption;

    /**
     * saves the sent message into db and echoes it as <div> string
     * @return void
     */
    protected function executeSqlQuery()
    {
        $oChatMsg = new ChatMessage();
        $aData = [];
        $aData["chat_room_id"] = $this->getRequestParameter("roomId");
        $aData["user"] = $this->getRequestParameter("user");
        $text = $this->getRequestParameter("text");
        $aData["msg_text"] = $this->encrypt($text, Conf::getParam("key"));
        $aData["picture_url"] = $this->getFileUrlFromUpload();
        $aData["created_at"] = date("Y.m.d H:i:s",time());
        $oChatMsg->data = $aData;
        $oChatMsg->save();
    }

    protected function getFileUrlFromUpload()
    {
        $tmppath = $_FILES["upload"]["tmp_name"];
        $originalName = $_FILES["upload"]["name"];
        $extension = substr($originalName,strrpos($originalName, "."));
        $name = $this->getRequestParameter("roomId").$this->getRequestParameter("user").date("Y_m_d-H_i_s",time()).$extension;
        $type = $_FILES["upload"]["type"];
        $locationbegin = __DIR__ . '\..\pics\\';
        $location = $locationbegin . $name;
        if (substr($type, 0, 6) === "image/") {
            move_uploaded_file($tmppath, $location);
            return $this->encrypt($this->getUrl('pics/'.$name), Conf::getParam("key"));
        }
        return "";
    }
}