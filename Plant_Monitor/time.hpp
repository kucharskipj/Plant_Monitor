#ifndef TIME__HPP
#define TIME__HPP

#include <Arduino.h>

class Time{

    const long gmtOffset_sec = 0;
    const int daylightOffset_sec = 0;
    struct tm timeinfo;

    public:
        // Initializing time library
        Time();
        // This function takes current time from NTP pools and transform it to the format of FireStore timestamp
        String get_current_time();

};

#endif