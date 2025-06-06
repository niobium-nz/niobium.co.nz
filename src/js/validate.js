jQuery(document).ready(function ($) {
  "use strict";

  var phonePatterns = {
    "+1": /^\+?1\d{10}$/,  // ���� / ���ô� (10 λ)
    "+44": /^\+?44\d{10}$/, // Ӣ�� (10 λ)
    "+49": /^\+?49\d{10,11}$/, // �¹� (10-11 λ)
    "+33": /^\+?33\d{9}$/,  // ���� (9 λ)
    "+61": /^\+?61\d{9}$/   // �Ĵ����� (9 λ)
  };

  function isValidCreditCard(cardNumber) {
    var digits = cardNumber.replace(/\s/g, '').split('').reverse();
    var sum = 0;

    for (var i = 0; i < digits.length; i++) {
      var num = parseInt(digits[i], 10);
      if (i % 2 === 1) {
        num *= 2;
        if (num > 9) num -= 9;
      }
      sum += num;
    }
    return sum % 10 === 0;
  }

  $("#order_card_number").on("input", function (e) {
    var rawValue = $(this).val().replace(/\D/g, ''); // ֻ��������
    var formattedValue = formatCardNumber(rawValue);

    var cursorPosition = this.selectionStart;
    var previousLength = $(this).val().length;
    $(this).val(formattedValue);

    // �����µĹ��λ�ã��������뵽�ո�ǰ��
    setTimeout(() => {
      this.selectionStart = this.selectionEnd = adjustCursorPosition(cursorPosition, previousLength, formattedValue);
    }, 0);
  });

  // **���ÿ���ʽ������**
  function formatCardNumber(number) {
    if (number.startsWith("34") || number.startsWith("37")) {
      // American Express: XXXX XXXXXX XXXXX
      return number.replace(/(\d{4})(\d{6})?(\d{0,5})?/, function (_, p1, p2, p3) {
        return [p1, p2, p3].filter(Boolean).join(" ");
      });
    } else {
      // Visa, MasterCard, Discover, JCB: XXXX XXXX XXXX XXXX
      return number.replace(/(\d{4})(\d{4})?(\d{4})?(\d{0,4})?/, function (_, p1, p2, p3, p4) {
        return [p1, p2, p3, p4].filter(Boolean).join(" ");
      });
    }
  }

  // **���ֹ��λ��**
  function adjustCursorPosition(cursorPosition, previousLength, formattedValue) {
    var newLength = formattedValue.length;
    if (newLength > previousLength && formattedValue[cursorPosition - 1] === " ") {
      return cursorPosition + 1; // �����Զ�����ո�ʱ�����������
    }
    return cursorPosition;
  }

  $("#order_card_expiry").on("input", function (e) {
    var value = $(this).val();
    var newValue = value.replace(/\D/g, ''); // ����������

    // ������� 4 λ����
    if (newValue.length > 4) {
      newValue = newValue.substring(0, 4);
    }

    // �����뵽�� 2 λ���Զ����� "/"
    if (newValue.length >= 2) {
      newValue = newValue.substring(0, 2) + '/' + newValue.substring(2);
    }


    $(this).val(newValue);
  });

  $("#order_card_expiry").on("keydown", function (e) {
    var value = $(this).val();
    if (e.key === "Backspace" && value.endsWith("/")) {
      // �˸�ʱ�����ɾ������ "/"����ͬʱɾ��ǰһλ����
      $(this).val(value.slice(0, 1));
      e.preventDefault(); // ��ֹĬ��ɾ�� `/`
    }
  });

  $.validator.addMethod("validExpiry", function (value, element) {
    var regex = /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/;
    if (!regex.test(value)) {
      return false;
    }

    var parts = value.split('/');
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[1], 10);

    if (year < 100) {
      year += 2000;
    }

    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth() + 1;

    if (year < currentYear) {
      return false;
    }

    if (year === currentYear && month < currentMonth) {
      return false;
    }

    return true;
  }, "Please input validate card expiry (MM/YY)");
  // �Զ�����֤���� - CVC
  $.validator.addMethod("validCVC", function (value, element) {
    return /^\d{3,4}$/.test(value); // ���� 3 �� 4 λ����
  }, "xxxxxxxxxxxxx"); //TODO

  $.validator.addMethod("validCreditCard", function (value, element) {
    var cardNumber = value.replace(/\s/g, ''); // ȥ���ո�
    if (!/^\d{13,19}$/.test(cardNumber)) return false; // ȷ���� 13-19 λ����
    return isValidCreditCard(cardNumber); // ʹ�� Luhn �㷨��֤
  }, "��������Ч�����ÿ���");


  $.validator.addMethod("validPhone", function (value, element) {
    if (!phonePatterns["+1"]) return false;
    return phonePatterns["+1"].test(value);
  }, "xxxxxxxxxx");

  $.validator.addMethod("notDefault", function (value, element) {
    return value !== ""; // �����ǿ�ֵ
  }, "xxxxxxxxxxxxx"); //TODO

  $("#bill_form").validate({
    rules: {
      bill_firstname: "required",
      bill_lastname: "required",
      bill_address: "required",
      bill_country: {
        required: true,
        notDefault: true
      },
      bill_zipcode: "required",
      bill_email: {
        required: true,
        email: true,
      },
      bill_phone: {
        required: true,
        validPhone: true
      }
    },
    messages: {
      bill_firstname: "xxxxxxx",
      bill_lastname: "xxxxxxxxx",
      bill_address: "xxxxxxxxxxxx",
      bill_country: {
        required: "xxxxxxxxxxxx",
        notDefault: "xxxxxxxxxxxx"
      },
      bill_zipcode: "xxxxxxxxxxxx",
      bill_email: {
        required: "xxxxxxxxxxx",
        email: "xxxxxxxxxxxxx",
      },
      bill_phone: {
        required: "xxxxxxxxxxxxx",
        validPhone: "xxxxxxxxxxxxxx"
      }
    }
  })


  $("#c_ship_different_address").on("change", function () {
    if ($(this).is(":checked")) {
      $("#bill_diff_firstname").rules("add", {
        required: true,
        messages: {
          required: "xxxxxxxxxxxxx",
        }
      });

      $("#bill_diff_lastname").rules("add", {
        required: true,
        messages: {
          required: "xxxxxxxxxxxxx",
        }
      });

      $("#bill_diff_address").rules("add", {
        required: true,
        messages: {
          required: "xxxxxxxxxx",
        }
      });

      $("#bill_diff_country").rules("add", {
        required: true,
        notDefault: true,
        messages: {
          required: "xxxxxxxxxx",
        }
      });

      $("#bill_diff_zipcode").rules("add", {
        required: true,
        messages: {
          required: "xxxxxxxxxxx",
        }
      });
      $("#bill_diff_email").rules("add", {
        required: true,
        messages: {
          required: "xxxxxxxxxxxxx",
        }
      });

      $("#bill_diff_phone").rules("add", {
        required: true,
        validPhone: true,
        messages: {
          required: "xxxxxxxxxxxx",
          validPhone: "xxxxxxxxxxx",
        }
      });
    } else {
      $("#bill_diff_firstname").rules("remove");
      $("#bill_diff_lastname").rules("remove");
      $("#bill_diff_address").rules("remove");
      $("#bill_diff_country").rules("remove");
      $("#bill_diff_zipcode").rules("remove");
      $("#bill_diff_email").rules("remove");
      $("#bill_diff_phone").rules("remove");
    }
  });

  $("#order_form").validate({
    rules: {
      order_card_number: {
        required: true,
        validCreditCard: true
      },
      order_card_expiry: {
        required: true,
        validExpiry: true
      },
      order_card_cvc: {
        required: true,
        validCVC: true
      },
      order_card_name: "required"
    },
    messages: {
      order_card_number: {
        required: "xxxxxxxxxx",
        validCreditCard: "xxxxxxxxxxxxxx"
      },
      order_card_expiry: {
        required: "xxxxxxxxxxx",
      },
      order_card_cvc: {
        required: "xxxxxxxxxxxx",
        validCVC: "xxxxxxxxxxxxx"
      },
      order_card_name: "xxxxxxxxxxxxx"
    }
  });

  $("#submit").on("click", function () {
    var order = $("#order_form").valid();
    var bill = $("#bill_form").valid()
    if (order && bill) {
      submit();
    }
  });

  function submit() {
    var b_fname = $("#bill_firstname").val();
    var b_lname = $("#bill_lastname").val();
    var b_cname = $("#bill_companyname").val();
    var b_address = $("#bill_address").val();
    var b_address1 = $("#bill_address_1").val();
    var b_address2 = $("#bill_address_2").val();
    var b_country = $("#bill_country").val();
    var b_zipcode = $("#bill_zipcode").val();
    var b_email = $("#bill_email").val();
    var b_phone = $("#bill_phone").val();

    var b_pwd = $("#c_create_account").is(":checked") && $("#bill_accountpwd").val();

    var b_d_fname = $("#bill_diff_firstname").val();
    var b_d_lname = $("#bill_diff_lastname").val();
    var b_d_cname = $("#bill_diff_companyname").val();
    var b_d_address = $("#bill_diff_address").val();
    var b_d_address1 = $("#bill_diff_address_1").val();
    var b_d_address2 = $("#bill_diff_address_2").val();
    var b_d_country = $("#bill_diff_country").val();
    var b_d_zipcode = $("#bill_diff_zipcode").val();
    var b_d_email = $("#bill_diff_email").val();
    var b_d_phone = $("#bill_diff_phone").val();

    var b_notes = $("#bill_notes").val();

    var o_cardnumber = $("#order_card_number").val();
    var o_expiry = $("#order_card_expiry").val();
    var o_cvc = $("#order_card_cvc").val();
    var o_cardname = $("#order_card_name").val();

    console.log({
      bill: {
        firstname: b_fname,
        lastname: b_lname,
        companyname: b_cname,
        address: b_address,
        address1: b_address1,
        address2: b_address2,
        country: b_country,
        zipcode: b_zipcode,
        email: b_email,
        phone: b_phone,
        password: b_pwd,
        notes: b_notes
      },
      shipaddress: $("#c_ship_different_address").is(":checked") &&
      {
        firstname: b_d_fname,
        lastname: b_d_lname,
        companyname: b_d_cname,
        address: b_d_address,
        address1: b_d_address1,
        address2: b_d_address2,
        country: b_d_country,
        zipcode: b_d_zipcode,
        email: b_d_email,
        phone: b_d_phone,
        password: b_d_pwd,
      },
      order: {
        cardnumber: o_cardnumber,
        expiry: o_expiry,
        cvc: o_cvc,
        cardname: o_cardname
      }
    })
  }

  $("input[name='product-img']").on("change", function () {
    var path = $("input[name='product-img']:checked").attr("path");
    $("#prudoct_im").attr("src", path);
    calcOrder();
  });

  $("input[name='product-attr']").on("change", function () {
    calcOrder();
  })

  $("#product_count").on("change", function () {
    calcOrder();
  })

  $('.adjust').on('click', function (e) {
    calcOrder();
  });

  function calcOrder() {
    var count = +$("#product_count").val();
    var price = +$("#product_price").attr("price");
    var total = price * count;
    console.log(total);
    $.each($("input[delta]:checked"), function (index, v) {
      var delta = +$(v).attr("delta");
      console.log(delta);
      total += delta*count;
      console.log(total);
    })
  }
})