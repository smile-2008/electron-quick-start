//

// 应用配置模块
var settings
function setupApp() {

	function saveSettings() {

	    localStorage['settings'] = JSON.stringify(settings)
	}

	settings = localStorage['settings']

	if (settings) {

	    settings = JSON.parse(settings)
	} else {

	    settings = {
	        bookIndex: {

	        },
	        curBook: ""
	    }
	}

}

setupApp()

// $("#menu").jqxMenu({ height: '30px' });


// 透明窗体模块
var el = $('#main')

var sx, sy
var windowX, windowY
window.isMouseDown = false


el.on('dblclick', (e) => {
    el.attr('contenteditable', true)
})

el.on('blur', (e) => {
    $('html').removeClass('focus');
    el.attr('contenteditable', false)
})
el.on('focus', (e) => {
    $('html').addClass('focus')
})
el.on('mousedown', (e) => {

	if (e.button == 1) {
		return
	}
    window.isMouseDown = true

    sx = e.screenX
    sy = e.screenY

    windowX = window.screenX
    windowY = window.screenY


})

$(window).on('mousemove', (e) => {
    // console.log(window.isMouseDown)


    if (window.isMouseDown == true && !$('html').hasClass('focus')) {
        // isDrag = true

        window.moveTo(windowX + (e.screenX - sx), windowY + (e.screenY - sy))
    }
})

$(window).on('mouseenter', (e) => {
    console.log('enter')
    if (e.altKey) {

        $('body').toggleClass('transparent')
    }

})


el.on('mouseup', (e) => {
    isMouseDown = false
    // isDrag = false
})

// 文本功能模块

var elFileList = $('.filelist')
var elChapterList = $('.chapter-list')

var cur = 0
var line = 6
var lineMax = 35
var fs = require('fs')

var filelist = fs.readdirSync(`${__dirname}/../txt/`)
var txtPath = `${__dirname}/../txt/`

filelist.forEach((file, i) => {

    $('<div>').text(file).appendTo(elFileList)
})



function openBook(book) {

    curBook = book
    var text = fs.readFileSync(`${txtPath}${book}`).toString()
    var list = text.split(/\n/)

    page = []
    chapters = []
    var item = ''
    var i2 = 0
    for (var i = 0; i < list.length; i++) {
        var l = list[i]

        if (l.length > lineMax) {
            // if (false && l.length > lineMax) {

            var n = Math.ceil(l.length / lineMax)

            for (var j = 0; j < n; j++) {

                var l2 = l.substr(j * lineMax, lineMax)
                item += l2 + "\n"
                if (l2.match(/^第.{1,3}章/)) {
                    chapters.push({
                        index: page.length,
                        text: l2
                    })
                }

                if ((i2 + 1) % line == 0) {
                    page.push(item)
                    item = ""
                }

                i2++
            }


        } else {

            if ((i2 + 1) % line == 0) {
                page.push(item)
                item = ""
            }

            i2++


            item += l + "\n"

            if (l.match(/^第.{1,3}章/)) {
                chapters.push({
                    index: page.length,
                    text: l
                })
            }
        }

    }

    console.log(chapters)

    chapters.forEach((chapter, i) => {

        $('<div>').text(chapter.text).attr('index', chapter.index).appendTo(elChapterList)
    })


    cur = settings.bookIndex[book]
    if (!cur)
        cur = 0
    el.text(page[cur])
}


$(window).on('contextmenu', (e) => {
    elFileList.show().css({
        left: e.clientX,
        top: e.clientY
    })
})

$(window).on('click', (e) => {
    elFileList.hide()
    elChapterList.hide()
})
$(window).on('mousedown', (e) => {

	if (e.button == 1) {
    elChapterList.show().css({
        left: e.clientX,
        top: e.clientY
    })		

    e.preventDefault()
    e.stopPropagation()
	}
})
elFileList.on('click', 'div', (e) => {
    var book = e.target.innerText

    settings.curBook = book

    openBook(book)

    saveSettings()
})

elChapterList.on('click', 'div', (e) => {
    var index = e.target.getAttribute('index') - 0

    settings.bookIndex[curBook] = index
    cur = index

    $('.cur-page').text(cur + 1)


    saveSettings()

    el.text(page[index])
})





//



openBook(settings.curBook)


$('.cur-page').text(cur + 1)
$('.total-page').text(page.length)

var page
var chapters
var curBook





// 文字阅读显示模块

$(window).on('mousewheel', (e) => {
	var isHas = $(e.target).parents().hasClass('chapter-list')	

	if (isHas) {
		return;
	}
    if (e.originalEvent.deltaY < 0) {
        cur--
        if (cur < 0) {
            cur = 0
        }
    } else {
        cur++
        if (cur > page.length - 1) {
            cur = page.length - 1
        }
    }


    $('.cur-page').text(cur + 1)

    el.text(page[cur])

    settings.bookIndex[curBook] = cur

    saveSettings()
})
$(window).on('keydown', (e) => {

    var isPress = false



    if (e.keyCode == 38) {
        isPress = true
        cur--
        if (cur < 0) {
            cur = 0
        }
    }
    if (e.keyCode == 40) {
        isPress = true
        cur++
        if (cur > page.length - 1) {
            cur = page.length - 1
        }
    }

    if (!isPress)
        return
    $('.cur-page').text(cur + 1)

    el.text(page[cur])

    localStorage.setItem('curPage', cur)
})

$('.cur-page').on('blur', (e) => {

    var cur = e.target.innerText.trim()

    if (cur) {
        el.text(page[cur])
    }
})