#include <LiquidCrystal_I2C.h>
const int pot_pin = 34;
LiquidCrystal_I2C lcd(0x27, 16, 2); 

void setup() {
  lcd.init(); 
  lcd.backlight();
}
float kw;
void loop() {
  Serial.print("holaaa");
  kw = analogRead(pot_pin);
  kw = (kw/4095.0)*5.5;
  lcd.setCursor(0, 0);      
  lcd.print(kw);
  lcd.print(" k[W]");       
  delay(100);
}
