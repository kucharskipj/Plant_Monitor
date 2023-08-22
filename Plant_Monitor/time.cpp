#include "time.hpp"

Time::Time(){
    configTime(gmtOffset_sec, daylightOffset_sec, "pool.ntp.org", "time.nist.gov", "pl.pool.ntp.org");
}

String Time::get_current_time(){
 int ntp_counter = 0;
    Serial.println("Getting current time form NTP server...");
    while(!getLocalTime(&(this->timeinfo))){
      ntp_counter++;
      if (ntp_counter > 10){
        break;
      }
      delay(100);
    }
    Serial.println("OK");
    return String(this->timeinfo.tm_year + 1900) + "-" + String(this->timeinfo.tm_mon + 1) + "-" + String(this->timeinfo.tm_mday) + "T" + String(this->timeinfo.tm_hour) + ":" + String(this->timeinfo.tm_min)  + ":" + String(this->timeinfo.tm_sec) + "Z";
}



   
