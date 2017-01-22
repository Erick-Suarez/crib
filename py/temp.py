import pyupm_grove
import pyupm_i2clcd as lcd
import time
myLcd = lcd.Jhd1313m1(0, 0x3E, 0x62)
temp = pyupm_grove.GroveTemp(2)
myLcd.write (str(temp.raw_value()))