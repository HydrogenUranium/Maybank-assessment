class CompetitionForm {
  constructor() {
    this.config = {
      urlToken: '/libs/granite/csrf/token.json',
      urlRefreshCheck: '/apps/dhl/discoverdhlapi/refresh_token/index.json',
      urlGetAllDetails: '/apps/dhl/discoverdhlapi/getdetails/index.json',
      urlCompetition: '/apps/dhl/discoverdhlapi/competition/index.json'
    };

    this.sel = {
      component: '.competitionDataCapture form'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.readCookie = this.readCookie.bind(this);
    this.validate = this.validate.bind(this);

    this.tryCompetitionEntryLoggedIn = this.tryCompetitionEntryLoggedIn.bind(this);
    this.tryCompetitionEntryNotLoggedIn = this.tryCompetitionEntryNotLoggedIn.bind(this);
    this.completeCompetitionEntryLoggedIn = this.completeCompetitionEntryLoggedIn.bind(this);
  }

  bindEvents() {
  }

  getPathPrefix() {
    const prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
    return (prefix ? prefix : '');
  }

  readCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.bindEvents();
    this.validate();
    return true;
  }

  validate() {
    var competitionEntry = $(this.sel.component);

    if (competitionEntry.length > 0) {
      competitionEntry.each((index, item) => {
        if ($(item).closest('.competitionDataCapture').hasClass('not-logged-in')) {
          $(item).validate({
            rules: {
              register__yourEmail: 'email'
            },
            errorPlacement: (error, element) => {
              if (element.attr('type') === 'checkbox') {
                error.insertAfter($(element).parent().find('label'));
              } else if (element.attr('type') === 'password') {
                $(element).append(error);
                error.insertAfter($(element).parent());
              } else if (element.attr('type') === 'search') {
                error.insertAfter($(element).parent());
              } else {
                error.insertAfter($(element).parent());
              }
            },
            submitHandler: (form) => {
              this.tryCompetitionEntryNotLoggedIn(form);
              return false;
            }
          });
        } else {
          $(item).validate({
            errorPlacement: (error, element) => {
              if (element.attr('type') === 'checkbox') {
                error.insertAfter($(element).parent().find('label'));
              } else if (element.attr('type') === 'password') {
                $(element).append(error);
                error.insertAfter($(element).parent());
              } else if (element.attr('type') === 'search') {
                error.insertAfter($(element).parent());
              } else {
                error.insertAfter($(element).parent());
              }
            },
            submitHandler: (form) => {
              this.tryCompetitionEntryLoggedIn(form);
              return false;
            }
          });
        }
      });
    }
  }


  tryCompetitionEntryNotLoggedIn(form) {
    var frm = $(form);

    var data = { };
    if (frm.find('.comp-answer').length === 0) {
      var answer = frm.find("input[type='radio']:checked").val();
      if (answer === null || answer.length === 0) {
        alert('Please select an option');
        return;
      }

      data = {
        firstname: frm.find('input#register__firstName').val(),
        lastname: frm.find('input#register__lastName').val(),
        email: frm.find('input#register__yourEmail').val(),

        position: frm.find('input#register__position').val(),
        contact: frm.find('input#register__contactNumber').val(),
        size: frm.find('select#register__businessSize').val(),
        sector: frm.find('select#register__businessSector').val(),

        path: frm.data('path'),
        answer: answer
      };
    } else {
      data = {
        firstname: frm.find('input#register__firstName').val(),
        lastname: frm.find('input#register__lastName').val(),
        email: frm.find('input#register__yourEmail').val(),

        position: frm.find('input#register__position').val(),
        contact: frm.find('input#register__contactNumber').val(),
        size: frm.find('select#register__businessSize').val(),
        sector: frm.find('select#register__businessSector').val(),

        path: frm.data('path')
      };

      frm.find('.comp-answer').each((index, item) => {
        var val = $(item).val();
        if ($(item).data('index') === 1) {
          data.answer = val;
        } else {
          data['answer' + $(item).data('index')] = val;
        }
      });
    }
    if (($.trim(data.firstname).length === 0) || ($.trim(data.lastname).length === 0) || ($.trim(data.email).length === 0)) {
      alert('Please enter your name, email address and competition details.');
    } else {
      frm.find("button[type='submit']").text('please wait...');
      frm.find("input[type='submit']").val('please wait...');

      $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
        var csrftoken = tokenresponse.token;

        $.ajax({
          url: this.getPathPrefix() + this.config.urlCompetition,
          data: data,
          type: 'post',
          headers: { 'CSRF-Token': csrftoken },
          dataType: 'json',
          success: (response) => {
            if (response) {
              if (response.status === 'ok') {
                var modal = frm.closest('.competition-container').find('.modal');
                modal.find('.thanks-name').text(data.firstname);
                // modal.modal('show');
                modal.show().addClass('show');

                frm.closest('.competitionDataCapture').hide();
              } else {
                alert('An error occurred while attempting to enter the competition.\n' + response.error);
              }
            } else {
              alert('An unknown error occurred while attempting to enter the competition. Please try again later');
            }
            frm.find("button[type='submit']").text('Enter the competition');
            frm.find("input[type='submit']").val('Enter the competition');
          }
        });
      });
    }
  }

  tryCompetitionEntryLoggedIn(form) {
    var frm = $(form);
    frm.find("button[type='submit']").text('please wait...');
    frm.find("input[type='submit']").val('please wait...');

    var cookie = this.readCookie('DHL.AuthToken');
    if (cookie !== null) {
      var split = cookie.split('|');
      if (split.length >= 2) {
        $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
          var csrftoken = tokenresponse.token;
          $.ajax({
            url: this.getPathPrefix() + this.config.urlGetAllDetails,
            data: { username: split[0], token: split[1] },
            type: 'post',
            headers: { 'CSRF-Token': csrftoken },
            dataType: 'json',
            success: (allDetailsResponse) => {
              if (allDetailsResponse) {
                if (allDetailsResponse.status === 'ok') {
                  this.completeCompetitionEntryLoggedIn(form, allDetailsResponse);
                } else {
                  alert('An unknown error occurred while attempting to enter the competition. Please try again later');
                }
              } else {
                alert('An unknown error occurred while attempting to enter the competition. Please try again later');
              }
            }
          });
        });
      } else {
        alert('An unknown error occurred while attempting to enter the competition. Please try again later');
      }
    } else {
      var refreshCookie = this.readCookie('DHL.RefreshToken');
      if (refreshCookie !== null) {
        var refreshSplit = refreshCookie.split('|');
        if (refreshSplit.length >= 2) {
          $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
            var csrftoken = tokenresponse.token;
            $.ajax({
              url: this.getPathPrefix() + this.config.urlRefreshCheck,
              data: { username: refreshSplit[0], refresh_token: refreshSplit[1] },
              type: 'post',
              headers: { 'CSRF-Token': csrftoken },
              dataType: 'json',
              success: (refreshResponse) => {
                if (refreshResponse) {
                  if (refreshResponse.status === 'ok') {
                    $(window).trigger('checkauthtokens.DHL', [ refreshResponse, true ]);
                    this.tryCompetitionEntryLoggedIn(form);
                  } else {
                    alert('An unknown error occurred while attempting to enter the competition. Please try again later');
                  }
                } else {
                  alert('An unknown error occurred while attempting to enter the competition. Please try again later');
                }
              }
            });
          });
        } else {
          alert('An unknown error occurred while attempting to enter the competition. Please try again later');
        }
      } else {
        alert('An unknown error occurred while attempting to enter the competition. Please try again later');
      }
    }
  }

  completeCompetitionEntryLoggedIn(form, details) {
    var frm = $(form);

    var answer = '';
    if (frm.find('.comp-answer').length > 0) {
      answer = frm.find('.comp-answer').val();
    } else {
      answer = frm.find("input[type='radio']:checked").val();
      if (answer === null || answer.length === 0) {
        alert('Please select an option');
        frm.find("button[type='submit']").text('Enter the competition ' + details.registration_firstname);
        frm.find("input[type='submit']").val('Enter the competition ' + details.registration_firstname);
        return;
      }
    }

    var data = {
      firstname: details.registration_firstname,
      lastname: details.registration_lastname,
      email: details.registration_email,

      position: details.registration_position,
      contact: details.registration_contact,
      size: details.registration_size,
      sector: details.registration_sector,

      path: frm.data('path'),
      answer: answer
    };

    if (($.trim(data.answer).length === 0) || ($.trim(data.firstname).length === 0) || ($.trim(data.lastname).length === 0) || ($.trim(data.email).length === 0)) {
      alert('Please enter your name, email address and competition details.');
    } else {
      frm.find("button[type='submit']").text('please wait...');
      frm.find("input[type='submit']").val('please wait...');

      $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
        var csrftoken = tokenresponse.token;
        $.ajax({
          url: this.getPathPrefix() + this.config.urlCompetition,
          data: data,
          type: 'post',
          headers: { 'CSRF-Token': csrftoken },
          dataType: 'json',
          success: (response) => {
            if (response) {
              if (response.status === 'ok') {
                var modal = frm.closest('.competition-container').find('.modal');
                modal.find('.thanks-name').text(data.firstname);
                // modal.modal('show');
                modal.show().addClass('show');

                frm.closest('.competitionDataCapture').hide();
              } else {
                alert('An error occurred while attempting to enter the competition.\n' + response.error);
              }
            } else {
              alert('An unknown error occurred while attempting to enter the competition. Please try again later');
            }
            frm.find("button[type='submit']").text('Enter the competition ' + data.firstname);
            frm.find("input[type='submit']").val('Enter the competition ' + data.firstname);
          }
        });
      });
    }

    frm.find("button[type='submit']").text('Enter the competition');
    frm.find("input[type='submit']").val('Enter the competition');
  }
}

export default new CompetitionForm();
