#!/bin/bash
cd o4act_dev/o4act_front
npm install --force
ls
sed -i -e 's/\"http:\/\/localhost:4000\" +//g' App.js
expo build:web
mv App.js-e App.js
cd ../o4act_back
rsync -avP  --delete ../o4act_front/web-build/ ./web
rm -r ../o4act_front/web-build

sed -i -e 's/httpequiv/http-equiv/g' ./web/index.html
rm ./web/index.html-e

sed -i -e 's/static\/media/static\/static\/media/g' ./web/static/js/app*.js
rm ./web/index.html-e

sed -i -e "s/\"\//\".\//g" web/static/js/runtime*.js
rm web/static/js/app*.js-e

sed -i -e 's/\".\/fonts\//\".\/static\/fonts\//g' $(ls ./web/static/js/2.*.chunk.js | tail -n 1)
rm $(ls ./web/static/js/2.*.chunk.js-e | tail -n 1)

tidy -q -wrap 100000 -o web/index.html web/index.html
python3 ../../../../replace.py web/index.html

