.PHONY: run
run:
	bash -c "source venv/bin/activate && flask run"

.PHONY : runvue
runvue:
	bash -c "source venv/bin/activate &&  cd client_vuejs/ && npm run dev"

.PHONY: install
install:
	virtualenv -p python3 venv
	bash -c "source venv/bin/activate && pip install -r requirement.txt && flask syncdb"
	npm create vite@latest client
	cd client
	npm install
	npm run dev --host

.PHONY: loadb
loadb:
	virtualenv -p python3 venv
	bash -c "source venv/bin/activate && flask generate-inserts"
	sqlite3 server/myapp.db ".read server/script.sql"
