import requests
import sys
import json
from datetime import datetime, timedelta

class EduLinkAPITester:
    def __init__(self, base_url="https://mentorlink-22.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user = None
        self.tests_run = 0
        self.tests_passed = 0
        self.session = requests.Session()

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) < 500:
                        print(f"   Response: {response_data}")
                    elif isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:300]}...")

            return success, response.json() if response.text and response.text.strip() else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_seed_database(self):
        """Seed the database with test data"""
        success, response = self.run_test("Seed Database", "POST", "seed", 200)
        return success

    def test_login(self, email="student@demo.com", password="123"):
        """Test login and get token"""
        success, response = self.run_test(
            "Login",
            "POST",
            "auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'token' in response:
            self.token = response['token']
            self.user = response.get('user', {})
            print(f"   Logged in as: {self.user.get('full_name', 'Unknown')}")
            return True
        return False

    def test_register(self):
        """Test user registration"""
        test_user = {
            "full_name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": f"test_{datetime.now().strftime('%H%M%S')}@test.com",
            "password": "testpass123",
            "role": "student"
        }
        success, response = self.run_test(
            "Register New User",
            "POST",
            "auth/register",
            200,
            data=test_user
        )
        return success

    def test_get_mentors(self):
        """Test getting mentors list"""
        success, response = self.run_test(
            "Get Mentors",
            "GET",
            "mentors",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} mentors")
            return True, response
        return False, []

    def test_get_user(self, user_id):
        """Test getting user by ID"""
        success, response = self.run_test(
            f"Get User {user_id}",
            "GET",
            f"users/{user_id}",
            200
        )
        return success, response

    def test_book_session(self, mentor_id, subject="Mathematics"):
        """Test booking a session"""
        if not self.user:
            print("❌ No user logged in for session booking")
            return False

        # The API expects SessionCreate object and current_user_id as separate fields
        request_data = {
            "session_in": {
                "mentor_id": mentor_id,
                "subject": subject,
                "date_time": (datetime.now() + timedelta(days=1)).isoformat(),
                "notes": "Test session booking"
            },
            "current_user_id": self.user.get('id')
        }
        
        success, response = self.run_test(
            "Book Session",
            "POST",
            "sessions",
            200,
            data=request_data
        )
        return success, response

    def test_get_my_sessions(self):
        """Test getting user's sessions"""
        if not self.user:
            print("❌ No user logged in for getting sessions")
            return False, []

        success, response = self.run_test(
            "Get My Sessions",
            "GET",
            "sessions/my",
            200,
            params={"user_id": self.user.get('id')}
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} sessions")
            return True, response
        return False, []

def main():
    print("🚀 Starting EduLink+ API Testing...")
    tester = EduLinkAPITester()
    
    # Test sequence
    print("\n" + "="*50)
    print("PHASE 1: Basic API Tests")
    print("="*50)
    
    # Test root endpoint
    tester.test_root_endpoint()
    
    # Seed database
    tester.test_seed_database()
    
    print("\n" + "="*50)
    print("PHASE 2: Authentication Tests")
    print("="*50)
    
    # Test registration
    tester.test_register()
    
    # Test login
    if not tester.test_login():
        print("❌ Login failed, stopping tests")
        return 1
    
    print("\n" + "="*50)
    print("PHASE 3: Core Functionality Tests")
    print("="*50)
    
    # Test mentors
    mentors_success, mentors = tester.test_get_mentors()
    if not mentors_success or not mentors:
        print("❌ No mentors found, stopping session tests")
        return 1
    
    # Test user retrieval
    if tester.user:
        tester.test_get_user(tester.user.get('id'))
    
    # Test session booking
    mentor_id = mentors[0].get('id') if mentors else None
    if mentor_id:
        session_success, session = tester.test_book_session(mentor_id)
        if session_success:
            # Test getting sessions
            tester.test_get_my_sessions()
    
    # Print final results
    print("\n" + "="*50)
    print("TEST RESULTS")
    print("="*50)
    print(f"📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"📈 Success rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print("✅ Backend API tests mostly successful!")
        return 0
    else:
        print("❌ Backend API tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())