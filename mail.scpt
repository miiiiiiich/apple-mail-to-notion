on run argv
  set savePath to item 1 of argv -- 保存先のパス
  set senderAddress to item 2 of argv -- 保存するメールアドレス 最も早くオシャレになる方法KnowerMag mag2 0001622754 <mailmag@mag2premium.com>
  tell application "Mail"
    set theMessages to messages of inbox whose (sender is senderAddress) and (read status is false)
    set messageCount to count of theMessages

    if messageCount > 0 then
      repeat with i from 1 to messageCount
        set output to ""
        set thisMessage to item i of theMessages
        set read status of thisMessage to true -- 既読にする。なぜかエディタ上でエラーだが動作する
        set messageSubject to subject of thisMessage
        set messageContent to content of thisMessage
        set messageDate to date received of thisMessage
        set messageSender to sender of thisMessage
        set output to output & "Subject: " & messageSubject & return & "Date: " & messageDate & return & "Content: \n" & messageContent & return & return
        set saveFilePath to POSIX path of savePath & "/" & i & ".txt"
        set fileRef to open for access saveFilePath with write permission
        set eof fileRef to 0 -- ファイルの終端に移動
        write output to fileRef as «class utf8» -- エンコーディングをUTF-8に指定して保存
        close access fileRef
      end repeat

    end if
  end tell
end run