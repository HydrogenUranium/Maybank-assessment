class Toast {
  constructor(text, duration) {
    this.text = text;
    this.duration = duration;
    this.id = '_' + Math.random().toString(36).substr(2, 9);

    this.setText = this.setText.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.show = this.show.bind(this);

    let toast = document.createElement('div');
    toast.setAttribute('id', this.id);
    toast.setAttribute('class', 'toast');
    let inner = document.createElement('div');
    inner.setAttribute('class', 'inner');
    inner.innerText = this.text;
    toast.appendChild(inner);
    document.body.appendChild(toast);
    this.$toast = $('#' + this.id);
  }

  setText(text) {
    this.text = text;
    this.$toast.find('.inner').text(this.text);
  }

  setDuration(duration) {
    this.duration = duration;
  }

  show() {
    this.$toast.addClass('show');

    setTimeout(() => {
      this.$toast.removeClass('show');
    }, this.duration);
  }
}

export default Toast;
