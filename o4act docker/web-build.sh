#!/bin/bash


#cd ../o4ops_front
#npm install --force
#sed -i -e 's;"http://localhost:7878".*+;;g' App.js
#rm App.js-e
#expo build:web
#cd ../o4ops_back
##rsync -avP  --delete web-build/ ./web
#mv ../o4ops_front/web-build/ ../o4ops/web
#rm -r ../o4ops_front/web-build
#echo "---------------------> fin de la phase 1"
#sed -i -e 's/httpequiv/http-equiv/g' ./web/index.html
#rm ./web/index.html-e
#echo "---------------------> fin de la phase 2"
#sed -i -e "s/\"\//\".\//g" web/static/js/runtime*.js
#rm web/static/js/runtime*.js-e
#echo "---------------------> fin de la phase 3"
#sed -i -e 's/\".\/fonts\/AntDesign.ttf\"/\".\/static\/fonts\/AntDesign.ttf\"/g' $(ls ./web/static/js/2.*.chunk.js | tail -n 1)
#rm $(ls ./web/static/js/2.*.chunk.js-e | tail -n 1)
#echo "---------------------> fin de la phase 4"
#tidy -q -wrap 100000 -o web/index.html web/index.html
#echo "---------------------> fin de la phase 5"
#cd ../o4ops
#python3 ../../../replace.py web/index.html



cd ../o4ops_front
npm install --force
ls
sed -i -e 's/\"http:\/\/localhost:7878\" +//g' App.js
expo build:web
mv App.js-e App.js
cd ../o4ops_back
rsync -avP  --delete ../o4ops_front/web-build/ ./web
rm -r ../o4ops_front/web-build

sed -i -e 's/httpequiv/http-equiv/g' ./web/index.html
rm ./web/index.html-e

sed -i -e 's/static\/media/static\/static\/media/g' ./web/static/js/app*.js
rm ./web/index.html-e

sed -i -e "s/\"\//\".\//g" web/static/js/runtime*.js
rm web/static/js/app*.js-e

sed -i -e 's/\".\/fonts\//\".\/static\/fonts\//g' $(ls ./web/static/js/2.*.chunk.js | tail -n 1)
rm $(ls ./web/static/js/2.*.chunk.js-e | tail -n 1)

tidy -q -wrap 100000 -o web/index.html web/index.html
python3 ../../../replace.py web/index.html

