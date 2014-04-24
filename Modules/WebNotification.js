define(function(require, exports, module) {
  var EventHandler = require('famous/core/EventHandler');

  function WebNotification(options) {
    this.Notification = 'Notification' in window ? window.Notification : false;

    if (false === this.Notification) return;

    this.options = Object.create(WebNotification.DEFAULT_OPTIONS);
    this._eventInput = new EventHandler();
    this._eventOutput = new EventHandler();

    EventHandler.setInputHandler(this, this._eventInput);
    EventHandler.setOutputHandler(this, this._eventOutput);

    this._permission = 'default';

    if (options) this.setOptions(options);

    //_requestPermission.call(this);
    _bindEvent.call(this);
  }


  /**
   * OPTIONS
   *
   * title, {string}, The title that must be shown within the notification.
   * body, {string}, A string representing an extra content to display within
   * the notification.
   * dir, {string}, The direction of the notification; it can be auto, ltr,
   * or rtl. Default is ltr.
   * lang, {string}, This string must be a valid BCP 47 language tag.
   * http://tools.ietf.org/html/bcp47
   * tag, {string}, An ID for a given notification that allows to retrieve,
   * replace or remove it if necessary.
   * icon, {string}, The URL of an image to be used as an icon by the
   * notification.
   */
  WebNotification.DEFAULT_OPTIONS = {
    title: '',
    body: '',
    dir: 'ltr',
    lang: 'en-US',
    tag: 'famous-web-notification',
    icon: ''
  };

  function _requestPermission(callback) {
    if (this.Notification.permission === this._permission) return;

    this.Notification.requestPermission(function(permission) {
      this.Notification.permission = permission;
      this._permission = permission;

      if (callback !== undefined && typeof callback === 'function') {
        callback.call(this);
      }
    }.bind(this));
  }

  function _sendNotification(options) {
    if (options) this.setOptions(options);

    if (this.options.title === '') {
      this._eventOutput.emit('noMsg');
      return;
    }

    if (this._permission !== 'granted') {
      _requestPermission.call(this, function() {
        var notification = new this.Notification(this.options.title, {
          body: this.options.body,
          dir: this.options.dir,
          lang: this.options.lang,
          tag: this.options.tag,
          icon: this.options.icon,
        });
        this._eventOutput.emit('sent');
      }.bind(this));
    } else {
      var notification = new this.Notification(this.options.title, {
        body: this.options.body,
        dir: this.options.dir,
        lang: this.options.lang,
        tag: this.options.tag,
        icon: this.options.icon,
      });
      this._eventOutput.emit('sent');
    }
  }

  function _bindEvent() {
    this._eventInput.bindThis(this);
    this._eventInput.on('send', _sendNotification);
  }

  WebNotification.prototype.getPermission = function getPermission() {
    return this._permission = this.Notification.permission;
  }
  WebNotification.prototype.close = function close() {
    this.Notification.close();
    this._eventOutput.emit('close');
  }
  WebNotification.prototype.getTitle = function getTitle() {
    return this.options.title;
  }
  WebNotification.prototype.getBody = function getBody() {
    return this.options.body;
  }
  WebNotification.prototype.getDir = function getDir() {
    return this.options.dir;
  }
  WebNotification.prototype.getLang = function getLang() {
    return this.options.lang;
  }
  WebNotification.prototype.getTag = function getTag() {
    return this.options.tag;
  }
  WebNotification.prototype.getIcon = function getIcon() {
    return this.options.icon;
  }
  WebNotification.prototype.setOptions = function setOptions(options) {
    for (var attr in this.options) {
      if (options && options[attr] !== undefined) {
        this.options[attr] = options[attr];
      } else {
        this.options[attr] = this.options[attr];
      }
    }
  }

  module.exports = WebNotification;
});
