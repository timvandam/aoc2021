#include <vector>
#include <deque>
#include <string>
#include <variant>
#include <iostream>
#include <algorithm>
#include <unordered_map>
#include <fstream>
#include <sstream>

using namespace std;

int mem[4];

int charToIndex(char c) {
    if (c == 'x') {
        return 0;
    } else if (c == 'y') {
        return 1;
    } else if (c == 'z') {
        return 2;
    } else if (c == 'w') {
        return 3;
    }
    return -1;
}

void add(char a, int b) {
    mem[charToIndex(a)] += b;
}

void mul(char a, int b) {
    mem[charToIndex(a)] *= b;
}

void div(char a, int b) {
    mem[charToIndex(a)] /= b;
}

void mod(char a, int b) {
    mem[charToIndex(a)] %= b;
}

void eql(char a, int b) {
    mem[charToIndex(a)] = mem[charToIndex(a)] == b;
}

struct Command {
    string command;
    char reg;
    variant<char, int> val;
};

vector<Command> commands;

vector<string> split(const string& str, char delimiter) {
    vector<string> tokens;

    stringstream stream(str);
    string token;
    while (getline(stream, token, delimiter)) {
        tokens.push_back(token);
    }

    return tokens;
}

void parseFile() {
    ifstream file("24.txt");
    string line;
    if (file.is_open()) {
        while (getline(file, line)) {
            vector<string> tokens = split(line, ' ');
            if (tokens[0] == "inp") {
                commands.push_back(Command{"inp", tokens[1][0]});
            } else {
                variant<char, int> val;
                if (charToIndex(tokens[2][0]) == -1) {
                    val = stoi(tokens[2]);
                } else {
                    val = tokens[2][0];
                }
                commands.push_back(Command{tokens[0], tokens[1][0], val});
            }
        }
    } else {
        cout << "File not found >:(" << endl;
    }
}

void exec(const vector<Command>& commands, deque<int> inputs, int z) {
    for (int i = 0; i < 4; i++) mem[i] = 0;
    mem[charToIndex('z')] = z;

    for (const Command& command : commands) {
        if (command.command == "inp") {
            mem[charToIndex(command.reg)] = inputs[0];
            inputs.pop_front();
        } else {
            int b = holds_alternative<int>(command.val) ? get<int>(command.val) : mem[charToIndex(get<char>(command.val))];
            if (command.command == "add") {
                add(command.reg, b);
            } else if (command.command == "mul") {
                mul(command.reg, b);
            } else if (command.command == "div") {
                div(command.reg, b);
            } else if (command.command == "mod") {
                mod(command.reg, b);
            } else if (command.command == "eql") {
                eql(command.reg, b);
            }
        }
    }
}

vector<Command> getProgramForDigitIndex(int digitIndex) {
    vector<Command> program;

    int count = 0;
    for (int i = (int)commands.size() - 1; i >= 0; i--) {
        const Command& c = commands[i];
        program.push_back(c);
        if (c.command == "inp") {
            if (++count == 14 - digitIndex) {
                break;
            } else {
                program.clear();
            }
        }
    }

    reverse(program.begin(), program.end());
    return program;
}

vector<Command> digitPrograms[14];
void makeDigitPrograms() {
    for (int i = 0; i < 14; i++) digitPrograms[i] = getProgramForDigitIndex(i);
}

struct hash_pair {
    template <class T1, class T2>
    size_t operator()(const pair<T1, T2>& p) const
    {
        auto hash1 = hash<T1>{}(p.first);
        auto hash2 = hash<T2>{}(p.second);
        return hash1 ^ hash2;
    }
};

unordered_map<pair<int, int>, pair<string, bool>, hash_pair> dp;
pair<string, bool>& solve(int digitIndex, int z, bool biggest) {
    pair<int, int> state = make_pair(digitIndex, z);
    if (dp.find(state) != dp.end()) return dp[state];

    int start = biggest ? 9 : 1;
    int dir = biggest ? -1 : 1;
    for (int i = start; i >= 1 && i <= 9; i += dir) {
        exec(digitPrograms[digitIndex], {i}, z);
        int startZ = mem[charToIndex('z')];
        string allDigits;
        bool endsWithZero;
        if (digitIndex == 13) {
            allDigits = "";
            endsWithZero = startZ == 0;
        } else {
            pair<string, bool>& result = solve(digitIndex + 1, startZ, biggest);
            allDigits = result.first;
            endsWithZero = result.second;
        }
        if (endsWithZero) {
            dp[state] = make_pair(to_string(i) + allDigits, true);
            return dp[state];
        }
    }

    if (dp.find(state) == dp.end()) dp[state] = make_pair("", false);
    return dp[state];
}

int main() {
    parseFile();
    makeDigitPrograms();
    cout << "Part 1: " << solve(0, 0, true).first << endl;
    dp.erase(make_pair(0, 0));
    cout << "Part 2: " << solve(0, 0, false).first << endl;
    return 0;
}
