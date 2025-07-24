@echo off
cd /d "E:\site netx.js\SITE"
echo ==== [%DATE% %TIME%] Début mise à jour ==== >> cron_comets.log
node scripts\scrapeClassement.js >> cron_comets.log 2>&1
node scripts\scrapeTeam.js >> cron_comets.log 2>&1
echo ==== [%DATE% %TIME%] Fin mise à jour ==== >> cron_comets.log
echo. >> cron_comets.log
