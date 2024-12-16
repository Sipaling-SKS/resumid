import Int "mo:base/Int";
import Text "mo:base/Text";

module {
  public func formatTimestamp(timestamp : Int) : Text {
    let millis = timestamp / 1_000_000;
    let seconds = millis / 1_000;
    let fractionalMillis = millis % 1_000;

    var days = seconds / 86_400;
    let remainingSeconds = seconds % 86_400;

    let hour = remainingSeconds / 3_600;
    let minute = (remainingSeconds % 3_600) / 60;
    let second = remainingSeconds % 60;

    var year = 1970;
    while (days >= daysInYear(year)) {
      days -= daysInYear(year);
      year += 1;
    };

    var month = 1;
    while (days >= daysInMonth(year, month)) {
      days -= daysInMonth(year, month);
      month += 1;
    };

    let day = days + 1;

    let isoString = Int.toText(year) # "-" # padZero(month) # "-" # padZero(day) # "T" #
                    padZero(hour) # ":" # padZero(minute) # ":" # padZero(second) # "." #
                    padMillis(fractionalMillis) # "Z";

    return isoString;
  };

  private func isLeapYear(year : Int) : Bool {
    if (year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)) {
      return true;
    };
    false;
  };

  private func daysInYear(year : Int) : Int {
    if (isLeapYear(year)) {
      return 366;
    };
    365;
  };

  private func daysInMonth(year : Int, month : Int) : Int {
    switch (month) {
      case (1) { 31 };
      case (2) { if (isLeapYear(year)) { 29 } else { 28 } };
      case (3) { 31 };
      case (4) { 30 };
      case (5) { 31 };
      case (6) { 30 };
      case (7) { 31 };
      case (8) { 31 };
      case (9) { 30 };
      case (10) { 31 };
      case (11) { 30 };
      case (12) { 31 };
      case (_) { 0 };
    }
  };

  private func padZero(num : Int) : Text {
    if (num < 10) {
      return "0" # Int.toText(num);
    };
    Int.toText(num);
  };

  private func padMillis(millis : Int) : Text {
    if (millis < 10) {
      return "00" # Int.toText(millis);
    } else if (millis < 100) {
      return "0" # Int.toText(millis);
    };
    Int.toText(millis);
  };
};