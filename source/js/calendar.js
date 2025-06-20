
class ACalendar {
  constructor(element, language = 'en', options = {}) {
    this.element = element;
    this.now = new Date();
    this.dDay = this.now.getDate();
    this.dMonth = this.now.getMonth();
    this.dYear = this.now.getFullYear();
    this.nMonth = this.dMonth;
    this.nYear = this.dYear;
    this.currentLanguage = language;
    this.allPosts = null;
    this.months = null;
    this.current = {
      posts: [],
      prev: null,
      next: null,
    };

    this.settings = Object.assign({}, ACalendar.defaults, typeof calLanguages === 'undefined' ? {} : calLanguages[this.currentLanguage], options);

    if (this.settings.root[0] !== '/') this.settings.root = '/' + this.settings.root;
    if (!this.settings.root.endsWith('/')) this.settings.root += '/';

    this.draw();
  }

  async draw() {
    await this.loadPosts();

    const dWeekDayOfMonthStart = (new Date(this.dYear, this.dMonth, 1).getDay() - this.settings.weekOffset + 7) % 7;
    const dLastDayOfMonth = new Date(this.dYear, this.dMonth + 1, 0).getDate();
    let dLastDayOfPreviousMonth = new Date(this.dYear, this.dMonth, 0).getDate() - dWeekDayOfMonthStart + 1;

    this.element.innerHTML = '';
    const cHead = document.createElement('div');
    cHead.classList.add('cal-head');

    const cPrev = document.createElement('div');
    cPrev.innerHTML = this.settings.headArrows.previous;
    cPrev.addEventListener('click', () => this.previousMonth());

    const cNext = document.createElement('div');
    cNext.innerHTML = this.settings.headArrows.next;
    cNext.addEventListener('click', () => this.nextMonth());

    const cTitle = document.createElement('div');
    cTitle.classList.add('cal-title');
    const curDate = new Date(Date.UTC(this.dYear, this.dMonth));

    if (this.current.posts.length === 0) {
      cTitle.textContent = this.simpleDateFormat(curDate, this.settings.titleFormat);
    } else {
      const cTitleLink = document.createElement('a');
      cTitleLink.href = this.simpleDateFormat(curDate, this.settings.titleLinkFormat);
      cTitleLink.title = this.simpleDateFormat(curDate, this.settings.postsMonthTip);
      cTitleLink.textContent = this.simpleDateFormat(curDate, this.settings.titleFormat);
      cTitle.appendChild(cTitleLink);
    }

    cHead.appendChild(cPrev);
    cHead.appendChild(cTitle);
    cHead.appendChild(cNext);
    this.element.appendChild(cHead);

    const cTable = document.createElement('table');
    cTable.classList.add('cal');

    const cThead = document.createElement('thead');
    const cHeadRow = document.createElement('tr');
    let dayOfWeek = this.settings.weekOffset;
    for (let i = 0; i < 7; i++) {
      if (dayOfWeek > 6) dayOfWeek = 0;
      const th = document.createElement('th');
      th.scope = 'col';
      th.title = this.settings.dayOfWeek[dayOfWeek];
      th.textContent = this.settings.dayOfWeekShort[dayOfWeek];
      cHeadRow.appendChild(th);
      dayOfWeek++;
    }
    cThead.appendChild(cHeadRow);
    cTable.appendChild(cThead);

    const cTbody = document.createElement('tbody');
    let day = 1;
    let dayOfNextMonth = 1;
    for (let i = 0; i < 6; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < 7; j++) {
        const td = document.createElement('td');
        if (i * 7 + j < dWeekDayOfMonthStart) {
          td.classList.add('cal-gray');
          td.textContent = dLastDayOfPreviousMonth++;
        } else if (day <= dLastDayOfMonth) {
          if (day === this.dDay && this.dMonth === this.nMonth && this.dYear === this.nYear) {
            td.classList.add('cal-today');
          }

          const matches = this.current.posts.filter(p => {
            const postDate = new Date(Date.parse(p.date));
            return postDate.getDate() === day;
          });

          if (matches.length > 0) {
            const a = document.createElement('a');
            a.href = matches[0].link;
            a.title = matches[0].title;
            a.textContent = day++;
            td.appendChild(a);
          } else {
            td.textContent = day++;
          }
        } else {
          td.classList.add('cal-gray');
          td.textContent = dayOfNextMonth++;
        }
        tr.appendChild(td);
      }
      cTbody.appendChild(tr);
    }
    cTable.appendChild(cTbody);

    const cTfoot = document.createElement('tfoot');
    const trFoot = document.createElement('tr');
    const tdPrev = document.createElement('td');
    tdPrev.colSpan = 3;
    const tdNext = document.createElement('td');
    tdNext.colSpan = 3;
    const tdPad = document.createElement('td');
    tdPad.innerHTML = '&nbsp;';

    if (this.current.prev) {
      tdPrev.classList.add('cal-foot');
      tdPrev.title = this.simpleDateFormat(this.current.prev, this.settings.postsMonthTip);
      tdPrev.innerHTML = this.settings.footArrows.previous + this.settings.months[this.current.prev.getMonth()];
      tdPrev.addEventListener('click', () => this.toPostsMonth(this.current.prev));
    }

    if (this.current.next) {
      tdNext.classList.add('cal-foot');
      tdNext.title = this.simpleDateFormat(this.current.next, this.settings.postsMonthTip);
      tdNext.innerHTML = this.settings.months[this.current.next.getMonth()] + this.settings.footArrows.next;
      tdNext.addEventListener('click', () => this.toPostsMonth(this.current.next));
    }

    trFoot.appendChild(tdPrev);
    trFoot.appendChild(tdPad);
    trFoot.appendChild(tdNext);
    cTfoot.appendChild(trFoot);
    cTable.appendChild(cTfoot);

    this.element.appendChild(cTable);
  }

  simpleDateFormat(date, fmt) {
    const o = {
      'LMM+': this.settings.months[date.getMonth()],
      'MM+': date.getMonth() + 1
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (k === 'LMM+') ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
    }
    return fmt;
  }

  async loadPosts() {
    if (this.settings.single) {
      await this.loadAllPosts();
    } else {
      await this.loadPostsByMonth();
    }
    if (this.allPosts) {
      const key = this.dYear + '-' + String(this.dMonth + 1).padStart(2, '0');
      this.current.posts = this.allPosts[key] || [];
    }
  }

  async loadAllPosts() {
    if (this.settings.url && !this.allPosts) {
      const res = await fetch(this.settings.url);
      const data = await res.json();
      this.allPosts = data;
      this.initMonths(Object.keys(data));
    }
  }

  async loadPostsByMonth() {
    if (!this.months) {
      const res = await fetch(this.settings.root + 'list.json');
      const data = await res.json();
      this.initMonths(data);
    }

    const monthStr = String(this.dMonth + 1);  // ✅ 不補零
    const res = await fetch(`/calendar${this.settings.root.replace(/^\/|\/$/g, '')}/${this.dYear}-${monthStr}.json`);
    this.current.posts = await res.json();
  }

  initMonths(array) {
    this.months = array.map(item => {
      const ym = item.split('-');
      return new Date(Date.UTC(+ym[0], +ym[1] - 1));
    });
  }

  nextMonth() {
    if (this.dMonth < 11) {
      this.dMonth++;
    } else {
      this.dMonth = 0;
      this.dYear++;
    }
    this.draw();
  }

  previousMonth() {
    if (this.dMonth > 0) {
      this.dMonth--;
    } else {
      this.dMonth = 11;
      this.dYear--;
    }
    this.draw();
  }

  toPostsMonth(date) {
    if (date instanceof Date) {
      this.dYear = date.getFullYear();
      this.dMonth = date.getMonth();
      this.draw();
    }
  }

  static defaults = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    dayOfWeekShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    postsMonthTip: 'Posts published in LMM yyyy',
    titleFormat: 'yyyy LMM',
    titleLinkFormat: '/archives/yyyy/MM/',
    headArrows: { previous: '<span class="cal-prev"></span>', next: '<span class="cal-next"></span>' },
    footArrows: { previous: '« ', next: ' »' },
    weekOffset: 0,
    single: true,
    root: '/calendar/',
    url: '/calendar.json'
  }
}

// 使用方式：
// new ACalendar(document.getElementById('calendar'), 'zh', { url: '/calendar.json' });
