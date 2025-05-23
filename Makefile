.PHONY: run
run:
	bash -c "source venv/bin/activate && flask run"

.PHONY : runvue
runvue:
	bash -c "source venv/bin/activate &&  cd client_vuejs/ && npm run dev --host"

.PHONY: install
install:
	virtualenv -p python3 venv
	bash -c "source venv/bin/activate && pip install -r requirement.txt && flask syncdb"

.PHONY: loadb
loadb:
	virtualenv -p python3 venv
	bash -c "source venv/bin/activate && flask generate-inserts"
	sqlite3 server/myapp.db ".read server/script.sql"
