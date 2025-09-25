all: down up apply_migration status

apply_migration:
	docker-compose run --rm alembic alembic upgrade head
	docker-compose down backend && docker-compose up -d backend

up:
	docker-compose up -d --build

down:
	docker-compose down

clean:
	docker-compose down --volumes

status:
	echo "🔧 Waiting for services to start..."
	sleep 5
	docker-compose ps
	echo "🔧 Testing backend api..."
	curl -s "http://localhost:8000/" | python3 -m json.tool
	echo "🔧 Checking database tables..."
	docker-compose exec database psql -U mini_lims -d mini_lims -c "\dt"
	echo "🔧 Checking users table structure..."
	docker-compose exec database psql -U mini_lims -d mini_lims -c "\d users"

test:
	sleep 2
	for test_file in ../tests/*.sh; do \
		echo "Running $$test_file..."; \
		bash $$test_file > /dev/null 2>&1 || exit 1; \
		echo "✅ $$test_file passed!"; \
	done
	echo "🎉 All tests passed!"

test_verbose:
	sleep 2
	for test_file in ../tests/*.sh; do \
		echo "Running $$test_file..."; \
		bash $$test_file || exit 1; \
	echo "✅ $$test_file passed!"; \
	done

.PHONY: apply_migration up down status test test_verbose all clean