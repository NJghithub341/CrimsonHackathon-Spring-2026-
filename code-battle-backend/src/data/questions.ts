export interface Question {
  id: string;
  language: 'python' | 'java' | 'cpp';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'syntax' | 'algorithms' | 'data_structures' | 'oop' | 'debugging' | 'optimization';
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
  points: number;
  timeLimit: number; // seconds
  tags: string[];
}

export const QUESTIONS: Question[] = [
  // PYTHON QUESTIONS - BEGINNER
  {
    id: 'py_begin_001',
    language: 'python',
    difficulty: 'beginner',
    category: 'syntax',
    question: 'What will be the output of this Python code?',
    code: `x = 5
y = 10
print(x + y)`,
    options: ['5', '10', '15', 'Error'],
    correctAnswer: 2,
    explanation: 'The code adds x (5) and y (10) together, resulting in 15.',
    points: 10,
    timeLimit: 30,
    tags: ['variables', 'arithmetic', 'print']
  },
  {
    id: 'py_begin_002',
    language: 'python',
    difficulty: 'beginner',
    category: 'data_structures',
    question: 'Which of these correctly creates a list in Python?',
    options: ['list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = (1, 2, 3)', 'list = 1, 2, 3'],
    correctAnswer: 0,
    explanation: 'Lists in Python are created using square brackets [].',
    points: 10,
    timeLimit: 30,
    tags: ['lists', 'syntax', 'data_structures']
  },
  {
    id: 'py_begin_003',
    language: 'python',
    difficulty: 'beginner',
    category: 'syntax',
    question: 'What is the correct way to comment a single line in Python?',
    options: ['// This is a comment', '/* This is a comment */', '# This is a comment', '<!-- This is a comment -->'],
    correctAnswer: 2,
    explanation: 'Python uses the # symbol for single-line comments.',
    points: 10,
    timeLimit: 30,
    tags: ['comments', 'syntax']
  },
  {
    id: 'py_begin_004',
    language: 'python',
    difficulty: 'beginner',
    category: 'debugging',
    question: 'What will this code output?',
    code: `name = "Python"
print("Hello " + name + "!")`,
    options: ['Hello Python!', 'Hello Python', 'HelloPython!', 'Error'],
    correctAnswer: 0,
    explanation: 'String concatenation with + joins "Hello ", "Python", and "!" together.',
    points: 10,
    timeLimit: 30,
    tags: ['strings', 'concatenation']
  },

  // PYTHON QUESTIONS - INTERMEDIATE
  {
    id: 'py_inter_001',
    language: 'python',
    difficulty: 'intermediate',
    category: 'data_structures',
    question: 'What will be the output of this list comprehension?',
    code: `numbers = [1, 2, 3, 4, 5]
result = [x**2 for x in numbers if x % 2 == 0]
print(result)`,
    options: ['[1, 4, 9, 16, 25]', '[4, 16]', '[2, 4]', '[1, 9, 25]'],
    correctAnswer: 1,
    explanation: 'The comprehension squares even numbers: 2²=4 and 4²=16.',
    points: 20,
    timeLimit: 30,
    tags: ['list_comprehension', 'filtering', 'mathematical_operations']
  },
  {
    id: 'py_inter_002',
    language: 'python',
    difficulty: 'intermediate',
    category: 'oop',
    question: 'What will this class method return?',
    code: `class Calculator:
    def __init__(self, value):
        self.value = value

    def multiply(self, n):
        self.value *= n
        return self

calc = Calculator(5)
result = calc.multiply(3).multiply(2).value
print(result)`,
    options: ['5', '15', '30', 'Error'],
    correctAnswer: 2,
    explanation: 'Method chaining: 5 * 3 * 2 = 30. Each multiply() returns self.',
    points: 25,
    timeLimit: 30,
    tags: ['classes', 'method_chaining', 'oop']
  },
  {
    id: 'py_inter_003',
    language: 'python',
    difficulty: 'intermediate',
    category: 'algorithms',
    question: 'What does this recursive function calculate?',
    code: `def mystery(n):
    if n <= 1:
        return 1
    return n * mystery(n - 1)

print(mystery(4))`,
    options: ['10', '16', '24', '120'],
    correctAnswer: 2,
    explanation: 'This calculates factorial: 4! = 4 × 3 × 2 × 1 = 24.',
    points: 25,
    timeLimit: 30,
    tags: ['recursion', 'factorial', 'algorithms']
  },

  // JAVA QUESTIONS - BEGINNER
  {
    id: 'java_begin_001',
    language: 'java',
    difficulty: 'beginner',
    category: 'syntax',
    question: 'What is the correct way to declare a variable in Java?',
    options: ['var x = 10;', 'int x = 10;', 'x = 10;', 'integer x = 10;'],
    correctAnswer: 1,
    explanation: 'Java requires explicit type declaration: int x = 10;',
    points: 10,
    timeLimit: 30,
    tags: ['variables', 'syntax', 'types']
  },
  {
    id: 'java_begin_002',
    language: 'java',
    difficulty: 'beginner',
    category: 'oop',
    question: 'What will this Java code output?',
    code: `public class Main {
    public static void main(String[] args) {
        String greeting = "Hello";
        String name = "Java";
        System.out.println(greeting + " " + name + "!");
    }
}`,
    options: ['Hello Java!', 'Hello Java', 'greeting name!', 'Error'],
    correctAnswer: 0,
    explanation: 'String concatenation in Java joins the strings with spaces.',
    points: 10,
    timeLimit: 30,
    tags: ['strings', 'concatenation', 'main_method']
  },
  {
    id: 'java_begin_003',
    language: 'java',
    difficulty: 'beginner',
    category: 'data_structures',
    question: 'How do you create an array of integers in Java?',
    options: ['int[] arr = {1, 2, 3};', 'array arr = [1, 2, 3];', 'int arr[] = [1, 2, 3];', 'int arr = {1, 2, 3};'],
    correctAnswer: 0,
    explanation: 'Java arrays are declared with type[] name = {elements};',
    points: 10,
    timeLimit: 30,
    tags: ['arrays', 'syntax', 'data_structures']
  },

  // JAVA QUESTIONS - INTERMEDIATE
  {
    id: 'java_inter_001',
    language: 'java',
    difficulty: 'intermediate',
    category: 'oop',
    question: 'What will this inheritance example output?',
    code: `class Animal {
    void sound() { System.out.println("Animal sound"); }
}
class Dog extends Animal {
    void sound() { System.out.println("Woof!"); }
}
public class Main {
    public static void main(String[] args) {
        Animal pet = new Dog();
        pet.sound();
    }
}`,
    options: ['Animal sound', 'Woof!', 'Both outputs', 'Error'],
    correctAnswer: 1,
    explanation: 'Method overriding: Dog\'s sound() method overrides Animal\'s method.',
    points: 25,
    timeLimit: 30,
    tags: ['inheritance', 'polymorphism', 'method_overriding']
  },
  {
    id: 'java_inter_002',
    language: 'java',
    difficulty: 'intermediate',
    category: 'algorithms',
    question: 'What does this loop calculate?',
    code: `int result = 0;
for (int i = 1; i <= 5; i++) {
    result += i * i;
}
System.out.println(result);`,
    options: ['15', '25', '55', '125'],
    correctAnswer: 2,
    explanation: 'Sum of squares: 1² + 2² + 3² + 4² + 5² = 1 + 4 + 9 + 16 + 25 = 55',
    points: 20,
    timeLimit: 30,
    tags: ['loops', 'mathematical_operations', 'algorithms']
  },

  // C++ QUESTIONS - BEGINNER
  {
    id: 'cpp_begin_001',
    language: 'cpp',
    difficulty: 'beginner',
    category: 'syntax',
    question: 'What is the correct way to include the iostream library in C++?',
    options: ['#include <iostream>', 'import iostream;', '#include "iostream"', 'using iostream;'],
    correctAnswer: 0,
    explanation: 'C++ uses #include <iostream> for standard library headers.',
    points: 10,
    timeLimit: 30,
    tags: ['includes', 'preprocessing', 'syntax']
  },
  {
    id: 'cpp_begin_002',
    language: 'cpp',
    difficulty: 'beginner',
    category: 'syntax',
    question: 'What will this C++ code output?',
    code: `#include <iostream>
using namespace std;

int main() {
    int a = 10;
    int b = 20;
    cout << a + b << endl;
    return 0;
}`,
    options: ['10', '20', '30', 'Error'],
    correctAnswer: 2,
    explanation: 'The code outputs the sum of a (10) and b (20), which is 30.',
    points: 10,
    timeLimit: 30,
    tags: ['variables', 'arithmetic', 'cout']
  },
  {
    id: 'cpp_begin_003',
    language: 'cpp',
    difficulty: 'beginner',
    category: 'data_structures',
    question: 'How do you declare a pointer to an integer in C++?',
    options: ['int* ptr;', 'int ptr*;', 'pointer<int> ptr;', 'int& ptr;'],
    correctAnswer: 0,
    explanation: 'Pointers are declared with type* name; syntax in C++.',
    points: 15,
    timeLimit: 30,
    tags: ['pointers', 'syntax', 'memory']
  },

  // C++ QUESTIONS - INTERMEDIATE
  {
    id: 'cpp_inter_001',
    language: 'cpp',
    difficulty: 'intermediate',
    category: 'oop',
    question: 'What will this C++ class example output?',
    code: `#include <iostream>
using namespace std;

class Rectangle {
private:
    int width, height;
public:
    Rectangle(int w, int h) : width(w), height(h) {}
    int area() { return width * height; }
};

int main() {
    Rectangle rect(5, 4);
    cout << rect.area() << endl;
    return 0;
}`,
    options: ['9', '20', '5', '4'],
    correctAnswer: 1,
    explanation: 'Rectangle area = width × height = 5 × 4 = 20.',
    points: 25,
    timeLimit: 30,
    tags: ['classes', 'constructors', 'member_functions']
  },
  {
    id: 'cpp_inter_002',
    language: 'cpp',
    difficulty: 'intermediate',
    category: 'algorithms',
    question: 'What does this function do?',
    code: `bool isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

cout << isPrime(17);`,
    options: ['true (1)', 'false (0)', 'Error', '17'],
    correctAnswer: 0,
    explanation: '17 is prime (only divisible by 1 and itself), so function returns true.',
    points: 30,
    timeLimit: 30,
    tags: ['algorithms', 'prime_numbers', 'mathematical_operations']
  },

  // ADVANCED QUESTIONS
  {
    id: 'py_adv_001',
    language: 'python',
    difficulty: 'advanced',
    category: 'algorithms',
    question: 'What is the time complexity of this algorithm?',
    code: `def find_duplicates(arr):
    seen = set()
    duplicates = []
    for num in arr:
        if num in seen:
            duplicates.append(num)
        else:
            seen.add(num)
    return duplicates`,
    options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
    correctAnswer: 1,
    explanation: 'Single loop through array with O(1) set operations = O(n) time complexity.',
    points: 40,
    timeLimit: 30,
    tags: ['time_complexity', 'algorithms', 'sets']
  },
  {
    id: 'java_adv_001',
    language: 'java',
    difficulty: 'advanced',
    category: 'optimization',
    question: 'Which approach is more memory efficient for large datasets?',
    code: `// Approach A
List<String> processA(List<String> data) {
    return data.stream()
        .filter(s -> s.length() > 5)
        .collect(Collectors.toList());
}

// Approach B
void processB(List<String> data) {
    data.removeIf(s -> s.length() <= 5);
}`,
    options: ['Approach A', 'Approach B', 'Both equal', 'Depends on JVM'],
    correctAnswer: 1,
    explanation: 'Approach B modifies in-place, avoiding creation of new collection.',
    points: 45,
    timeLimit: 30,
    tags: ['optimization', 'memory_management', 'streams']
  },
  {
    id: 'cpp_adv_001',
    language: 'cpp',
    difficulty: 'advanced',
    category: 'optimization',
    question: 'What optimization does this code demonstrate?',
    code: `class Vector3D {
    float x, y, z;
public:
    Vector3D(float x, float y, float z) : x(x), y(y), z(z) {}

    Vector3D operator+(const Vector3D& other) const {
        return Vector3D(x + other.x, y + other.y, z + other.z);
    }

    Vector3D& operator+=(const Vector3D& other) {
        x += other.x; y += other.y; z += other.z;
        return *this;
    }
};`,
    options: ['Return Value Optimization', 'Move Semantics', 'In-place Operations', 'Template Specialization'],
    correctAnswer: 2,
    explanation: 'operator+= performs in-place addition, avoiding temporary object creation.',
    points: 50,
    timeLimit: 30,
    tags: ['optimization', 'operator_overloading', 'performance']
  },

  // EXPERT LEVEL QUESTIONS
  {
    id: 'py_expert_001',
    language: 'python',
    difficulty: 'expert',
    category: 'algorithms',
    question: 'What does this dynamic programming solution solve?',
    code: `def solve(n):
    if n <= 1:
        return n

    dp = [0] * (n + 1)
    dp[1] = 1

    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]

    return dp[n]`,
    options: ['Factorial', 'Fibonacci Sequence', 'Prime Counting', 'Power Calculation'],
    correctAnswer: 1,
    explanation: 'Classic DP solution for Fibonacci: each number is sum of previous two.',
    points: 60,
    timeLimit: 30,
    tags: ['dynamic_programming', 'fibonacci', 'optimization']
  },
  {
    id: 'java_expert_001',
    language: 'java',
    difficulty: 'expert',
    category: 'algorithms',
    question: 'What is the space complexity of this merge sort implementation?',
    code: `void mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

void merge(int[] arr, int left, int mid, int right) {
    int[] temp = new int[right - left + 1];
    // merge logic...
}`,
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 3,
    explanation: 'O(n) temp array × O(log n) recursion depth = O(n log n) space.',
    points: 70,
    timeLimit: 30,
    tags: ['merge_sort', 'space_complexity', 'recursion']
  },
  {
    id: 'cpp_expert_001',
    language: 'cpp',
    difficulty: 'expert',
    category: 'optimization',
    question: 'What advanced C++ feature does this code utilize?',
    code: `template<typename T>
class SmartPtr {
    T* ptr;
    size_t* ref_count;
public:
    SmartPtr(T* p) : ptr(p), ref_count(new size_t(1)) {}

    SmartPtr(const SmartPtr& other) : ptr(other.ptr), ref_count(other.ref_count) {
        ++(*ref_count);
    }

    ~SmartPtr() {
        if (--(*ref_count) == 0) {
            delete ptr;
            delete ref_count;
        }
    }
};`,
    options: ['RAII', 'Reference Counting', 'Template Metaprogramming', 'Move Semantics'],
    correctAnswer: 1,
    explanation: 'Implementation of reference-counted smart pointer for automatic memory management.',
    points: 80,
    timeLimit: 30,
    tags: ['smart_pointers', 'reference_counting', 'memory_management']
  }
];

export function getQuestionsByDifficulty(difficulty: Question['difficulty']): Question[] {
  return QUESTIONS.filter(q => q.difficulty === difficulty);
}

export function getQuestionsByLanguage(language: Question['language']): Question[] {
  return QUESTIONS.filter(q => q.language === language);
}

export function getQuestionsByCategory(category: Question['category']): Question[] {
  return QUESTIONS.filter(q => q.category === category);
}

export function getRandomQuestions(
  count: number,
  filters?: {
    difficulty?: Question['difficulty'];
    language?: Question['language'];
    category?: Question['category'];
  }
): Question[] {
  let filteredQuestions = [...QUESTIONS];

  if (filters) {
    if (filters.difficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === filters.difficulty);
    }
    if (filters.language) {
      filteredQuestions = filteredQuestions.filter(q => q.language === filters.language);
    }
    if (filters.category) {
      filteredQuestions = filteredQuestions.filter(q => q.category === filters.category);
    }
  }

  // Shuffle and return requested count
  const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find(q => q.id === id);
}

export function getDifficultyPoints(difficulty: Question['difficulty']): number {
  const pointsMap = {
    'beginner': 10,
    'intermediate': 25,
    'advanced': 40,
    'expert': 60
  };
  return pointsMap[difficulty];
}