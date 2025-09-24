echo "🔧 Testing backend api..."

curl -s http://localhost:8000/ | python3 -m json.tool

echo "🔧 Checking database tables..."

docker-compose exec database psql -U mini_lims -d mini_lims -c "\dt"

echo "🔧 Checking users table structure..."

docker-compose exec database psql -U mini_lims -d mini_lims -c "\d users"