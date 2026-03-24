#include <iostream>
#include <vector>
#include <fstream>
#include <cstdlib>
#include <ctime>

struct Features {
    int pulseCount;
    int maxHighDuration;
    int totalHighTime;
    int risingEdges;
    float avgHighDuration;
};

Features extractFeatures(const std::vector<int>& signal) {
    int pulseCount = 0;
    int maxHigh = 0;
    int currentHigh = 0;
    int totalHigh = 0;
    int risingEdges = 0;

    for (int i = 0; i < signal.size(); i++) {

        if (i > 0 && signal[i] == 1 && signal[i-1] == 0)
            risingEdges++;

        if (signal[i] == 1) {
            currentHigh++;
            totalHigh++;
        } else {
            if (currentHigh > 0) {
                pulseCount++;
                if (currentHigh > maxHigh)
                    maxHigh = currentHigh;
                currentHigh = 0;
            }
        }
    }

    float avg = pulseCount > 0 ? (float)totalHigh / pulseCount : 0;

    return {pulseCount, maxHigh, totalHigh, risingEdges, avg};
}

// Generate signal
std::vector<int> generateSignal(std::string type) {

    std::vector<int> signal(2000, 0);

    if (type == "Normal") {
        for (int i = 0; i < 5; i++) {
            int pos = rand() % 2000;
            signal[pos] = 1;
        }
    }

    else if (type == "Minor") {
        for (int i = 0; i < 30; i++) {
            int pos = rand() % 1950;
            for (int j = 0; j < 5; j++)
                signal[pos+j] = 1;
        }
    }

    else if (type == "Severe") {
        int pos = rand() % 1800;
        for (int j = 0; j < 150; j++)
            signal[pos+j] = 1;
    }

    return signal;
}

int main() {

    srand(time(0));

    std::ofstream file("dataset.csv");
    file << "pulseCount,maxHigh,totalHigh,risingEdges,avgHigh,label\n";

    for (int i = 0; i < 300; i++) {

        std::string label;
        if (i < 100) label = "Normal";
        else if (i < 200) label = "Minor";
        else label = "Severe";

        std::vector<int> sig = generateSignal(label);
        Features f = extractFeatures(sig);

        file << f.pulseCount << ","
             << f.maxHighDuration << ","
             << f.totalHighTime << ","
             << f.risingEdges << ","
             << f.avgHighDuration << ","
             << label << "\n";
    }

    file.close();
    std::cout << "Dataset generated!" << std::endl;
}