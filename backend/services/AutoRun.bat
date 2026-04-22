@echo off
title Run All Go Services

wt ^
  --title "Auth Service"     cmd /k "cd /d \"E:\Projects\Felege Yordanos\backend\services\auth-service\"    && color a && cls && go run cmd\main.go" ; ^
  new-tab --title "Gateway"  cmd /k "cd /d \"E:\Projects\Felege Yordanos\backend\services\gateway-service\" && color a && cls && go run cmd\main.go" ; ^
  new-tab --title "Letter"   cmd /k "cd /d \"E:\Projects\Felege Yordanos\backend\services\letter-service\"  && color a && cls && go run cmd\main.go" ; ^
  new-tab --title "Meeting"  cmd /k "cd /d \"E:\Projects\Felege Yordanos\backend\services\meeting-service\" && color a && cls && go run cmd\main.go" ; ^
  new-tab --title "Documents" cmd /k "cd /d \"E:\Projects\Felege Yordanos\backend\services\document-service\" && color a && cls && go run cmd\main.go" ; ^
  new-tab --title "News"      cmd /k "cd /d \"E:\Projects\Felege Yordanos\backend\services\news-service\"     && color a && cls && go run cmd\main.go" ; ^
  new-tab --title "Front End"  cmd /k "cd /d \"E:\Projects\Felege Yordanos\frontend\"                         && color a && cls && npm run dev"


:: Optional: pause so you can see if something went wrong immediately
:: pause