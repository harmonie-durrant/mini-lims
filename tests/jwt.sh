#!/bin/bash

set -e

BASE_URL="http://localhost:8000"
TEST_EMAIL="testuser$(date +%s)@example.com"
TEST_PASSWORD="testpassword123"
INVALID_EMAIL="invalid@example.com"
INVALID_PASSWORD="wrongpassword"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_test() {
    echo -e "${YELLOW}Testing: $1${NC}"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

print_success() {
    echo -e "✅ $1"
    PASSED_TESTS=$((PASSED_TESTS + 1))
}

print_failure() {
    echo -e "❌ $1"
    FAILED_TESTS=$((FAILED_TESTS + 1))
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_api_status() {
    print_header "API Status Check"
    print_test "Health check endpoint"

    response=$(curl -s -w "%{http_code}" -o /tmp/health_response "$BASE_URL/")
    http_code="${response: -3}"

    if [ "$http_code" -eq 200 ]; then
        content=$(cat /tmp/health_response)
        if echo "$content" | grep -q '"ok".*true'; then
            print_success "API is running and healthy"
            print_info "Response: $content"
        else
            print_failure "API running but unexpected response: $content"
            exit 1
        fi
    else
        print_failure "API not accessible (HTTP $http_code)"
        print_info "Make sure the backend is running: docker-compose up backend -d"
        exit 1
    fi
}

test_user_registration() {
    print_header "User Registration Tests"

    # Test 1: Valid user registration
    print_test "Register new user with valid credentials"
    response=$(curl -s -w "%{http_code}" -o /tmp/register_response -X POST "$BASE_URL/users?email=$TEST_EMAIL&password=$TEST_PASSWORD")
    http_code="${response: -3}"

    if [ "$http_code" -eq 200 ]; then
        content=$(cat /tmp/register_response)
        if echo "$content" | grep -q '"id".*[0-9]' && echo "$content" | grep -q "\"email\".*\"$TEST_EMAIL\""; then
            print_success "User registration successful"
            USER_ID=$(echo "$content" | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
            print_info "Created user ID: $USER_ID"
        else
            print_failure "User registration returned unexpected response: $content"
        fi
    else
        content=$(cat /tmp/register_response)
        print_failure "User registration failed (HTTP $http_code): $content"
    fi

    # Test 2: Duplicate email registration
    print_test "Register user with duplicate email (should fail)"
    response=$(curl -s -w "%{http_code}" -o /tmp/duplicate_response -X POST "$BASE_URL/users?email=$TEST_EMAIL&password=$TEST_PASSWORD")
    http_code="${response: -3}"

    if [ "$http_code" -eq 400 ]; then
        content=$(cat /tmp/duplicate_response)
        if echo "$content" | grep -q "Email already registered"; then
            print_success "Duplicate email properly rejected"
        else
            print_failure "Duplicate email rejected but wrong error message: $content"
        fi
    else
        content=$(cat /tmp/duplicate_response)
        print_failure "Duplicate email should return 400, got HTTP $http_code: $content"
    fi

    # Test 3: Invalid email format
    print_test "Register user with invalid email format (should fail)"
    response=$(curl -s -w "%{http_code}" -o /tmp/invalid_email_response -X POST "$BASE_URL/users?email=invalidemail&password=$TEST_PASSWORD")
    http_code="${response: -3}"

    if [ "$http_code" -eq 400 ]; then
        content=$(cat /tmp/invalid_email_response)
        if echo "$content" | grep -q "Invalid email"; then
            print_success "Invalid email format properly rejected"
        else
            print_failure "Invalid email rejected but wrong error message: $content"
        fi
    else
        content=$(cat /tmp/invalid_email_response)
        print_failure "Invalid email should return 400, got HTTP $http_code: $content"
    fi
}

test_user_login() {
    print_header "User Login Tests"

    # Test 1: Valid login
    print_test "Login with valid credentials"
    response=$(curl -s -w "%{http_code}" -o /tmp/login_response -X POST "$BASE_URL/login?email=$TEST_EMAIL&password=$TEST_PASSWORD")
    http_code="${response: -3}"

    if [ "$http_code" -eq 200 ]; then
        content=$(cat /tmp/login_response)
        if echo "$content" | grep -q '"access_token"' && echo "$content" | grep -q '"token_type".*"bearer"'; then
            print_success "Login successful"
            ACCESS_TOKEN=$(echo "$content" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
            print_info "JWT token received (length: ${#ACCESS_TOKEN})"
        else
            print_failure "Login returned unexpected response: $content"
        fi
    else
        content=$(cat /tmp/login_response)
        print_failure "Login failed (HTTP $http_code): $content"
    fi

    # Test 2: Login with invalid email
    print_test "Login with invalid email (should fail)"
    response=$(curl -s -w "%{http_code}" -o /tmp/invalid_login_response -X POST "$BASE_URL/login?email=$INVALID_EMAIL&password=$TEST_PASSWORD")
    http_code="${response: -3}"

    if [ "$http_code" -eq 401 ]; then
        content=$(cat /tmp/invalid_login_response)
        if echo "$content" | grep -q "Incorrect email or password"; then
            print_success "Invalid email login properly rejected"
        else
            print_failure "Invalid email rejected but wrong error message: $content"
        fi
    else
        content=$(cat /tmp/invalid_login_response)
        print_failure "Invalid email should return 401, got HTTP $http_code: $content"
    fi

    # Test 3: Login with invalid password
    print_test "Login with invalid password (should fail)"
    response=$(curl -s -w "%{http_code}" -o /tmp/invalid_pass_response -X POST "$BASE_URL/login?email=$TEST_EMAIL&password=$INVALID_PASSWORD")
    http_code="${response: -3}"

    if [ "$http_code" -eq 401 ]; then
        content=$(cat /tmp/invalid_pass_response)
        if echo "$content" | grep -q "Incorrect email or password"; then
            print_success "Invalid password login properly rejected"
        else
            print_failure "Invalid password rejected but wrong error message: $content"
        fi
    else
        content=$(cat /tmp/invalid_pass_response)
        print_failure "Invalid password should return 401, got HTTP $http_code: $content"
    fi
}

test_jwt_validation() {
    print_header "JWT Token Validation Tests"

    if [ -z "$ACCESS_TOKEN" ]; then
        print_failure "No access token available from login test"
        return
    fi

    # Test 1: Access protected endpoint with valid token
    print_test "Access protected endpoint with valid JWT token"
    response=$(curl -s -w "%{http_code}" -o /tmp/protected_response \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        "$BASE_URL/protected_test")
    http_code="${response: -3}"

    if [ "$http_code" -eq 200 ]; then
        content=$(cat /tmp/protected_response)
        if echo "$content" | grep -q '"ok".*true' && echo "$content" | grep -q '"message"' && echo "$content" | grep -q '"user_id"'; then
            print_success "Protected endpoint accessible with valid token"
            print_info "Response: $content"
        else
            print_failure "Protected endpoint returned unexpected response: $content"
        fi
    else
        content=$(cat /tmp/protected_response)
        print_failure "Protected endpoint failed (HTTP $http_code): $content"
    fi

    # Test 2: Access protected endpoint without token
    print_test "Access protected endpoint without token (should fail)"
    response=$(curl -s -w "%{http_code}" -o /tmp/no_token_response "$BASE_URL/protected_test")
    http_code="${response: -3}"
    
    if [ "$http_code" -eq 403 ] || [ "$http_code" -eq 401 ]; then
        content=$(cat /tmp/no_token_response)
        if echo "$content" | grep -q "Not authenticated"; then
            print_success "Protected endpoint properly secured (no token)"
        else
            print_failure "Protected endpoint secured but wrong error message: $content"
        fi
    else
        content=$(cat /tmp/no_token_response)
        print_failure "Protected endpoint should return 401/403, got HTTP $http_code: $content"
    fi

    # Test 3: Access protected endpoint with invalid token
    print_test "Access protected endpoint with invalid token (should fail)"
    response=$(curl -s -w "%{http_code}" -o /tmp/invalid_token_response \
        -H "Authorization: Bearer invalid_token_here" \
        "$BASE_URL/protected_test")
    http_code="${response: -3}"
    
    if [ "$http_code" -eq 401 ]; then
        content=$(cat /tmp/invalid_token_response)
        if echo "$content" | grep -q "Could not validate credentials"; then
            print_success "Invalid token properly rejected"
        else
            print_failure "Invalid token rejected but wrong error message: $content"
        fi
    else
        content=$(cat /tmp/invalid_token_response)
        print_failure "Invalid token should return 401, got HTTP $http_code: $content"
    fi
}

test_user_retrieval() {
    print_header "User Retrieval Tests"

    if [ -z "$USER_ID" ]; then
        print_failure "No user ID available from registration test"
        return
    fi

    # Test 1: Get existing user
    print_test "Retrieve existing user by ID"
    response=$(curl -s -w "%{http_code}" -o /tmp/user_response "$BASE_URL/users/$USER_ID")
    http_code="${response: -3}"
    
    if [ "$http_code" -eq 200 ]; then
        content=$(cat /tmp/user_response)
        if echo "$content" | grep -q "\"id\":$USER_ID" && echo "$content" | grep -q "\"email\":\"$TEST_EMAIL\""; then
            print_success "User retrieval successful"
            print_info "User data: $content"
        else
            print_failure "User retrieval returned unexpected data: $content"
        fi
    else
        content=$(cat /tmp/user_response)
        print_failure "User retrieval failed (HTTP $http_code): $content"
    fi

    # Test 2: Get non-existent user
    print_test "Retrieve non-existent user (should fail)"
    response=$(curl -s -w "%{http_code}" -o /tmp/nonexistent_user_response "$BASE_URL/users/99999")
    http_code="${response: -3}"

    if [ "$http_code" -eq 404 ]; then
        content=$(cat /tmp/nonexistent_user_response)
        if echo "$content" | grep -q "User not found"; then
            print_success "Non-existent user properly handled"
        else
            print_failure "Non-existent user returned wrong error: $content"
        fi
    else
        content=$(cat /tmp/nonexistent_user_response)
        print_failure "Non-existent user should return 404, got HTTP $http_code: $content"
    fi
}

print_results() {
    print_header "Test Results Summary"
    echo -e "${BLUE}Total Tests: $TOTAL_TESTS${NC}"
    echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
    echo -e "${RED}Failed: $FAILED_TESTS${NC}"

    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed!${NC}"
        echo -e "${GREEN}JWT Authentication is working correctly.${NC}"
    else
        echo -e "${RED}❌ Some tests failed.${NC}"
        echo -e "${YELLOW}Check the output above for details.${NC}"
    fi

    rm -f /tmp/health_response /tmp/register_response /tmp/duplicate_response 
    rm -f /tmp/invalid_email_response /tmp/login_response /tmp/invalid_login_response
    rm -f /tmp/invalid_pass_response /tmp/protected_response /tmp/no_token_response
    rm -f /tmp/invalid_token_response /tmp/user_response /tmp/nonexistent_user_response
    rm -f /tmp/swagger_response /tmp/redoc_response /tmp/openapi_response
}

main() {
    print_header "Mini LIMS JWT Authentication Test Suite"
    print_info "Testing API at: $BASE_URL"
    print_info "Test user email: $TEST_EMAIL"
    echo ""

    check_api_status
    test_user_registration
    test_user_login
    test_jwt_validation
    test_user_retrieval

    echo ""
    print_results

    if [ $FAILED_TESTS -eq 0 ]; then
        exit 0
    else
        exit 1
    fi
}

main "$@"