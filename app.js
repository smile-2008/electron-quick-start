window.ondragover = function (e) { e.preventDefault(); return false };

        window.ondrop = function (e) { e.preventDefault(); return false };

//         var holder = document.getElementById('holder');

//         holder.ondragover = function () { this.className = 'hover'; return false; };

//         holder.ondragleave = function () { this.className = ''; return false; };

//         var h5 = document.querySelector("h5");

$(document).on('dragover',  '.album-list div', function(e) {

    this.className = 'hover';

})

$(document).on('dragleave', '.album-list div',  function(e) {

    this.className = '';

})

var DATA_str = localStorage.getItem('DATA');
var DATA = {
    albums: [{
        name: 'test',
        list: [
            'C:\\Users\\arthur\\Desktop\\HBC5C2616509229A.png'
        ],
        date: new Date()
    }, {
        name: 'test222',
        list: [
            'C:\\Users\\arthur\\Desktop\\u=1777948423,2879169011&fm=26&gp=0.jpg',
        ],
        date: new Date()

    }]
}
if (DATA_str) {
    DATA = JSON.parse(DATA_str);
} else {
    localStorage.setItem('DATA', JSON.stringify(DATA));
}

new Vue({
    el: '#app',
    data: {
        list: [],
        visible: false,

        DATA: DATA,

        selectedItem: {},

        activeName: 'first',

        dialogVisible: false,

        albumTitle: '',

        isEditAlbum: false
    },
    mounted: function() {
        var self = this;
        var str = localStorage['list'];

        this.visible = true

        if (str)
            this.list = JSON.parse(str)


        $(document).on('drop', '.album-list div',  function(e) {

            var list;

            if (self.activeName == 'first') {

                var j = $(this).index();

                list = self.DATA.albums[j - 1].list
            } else {
                list = self.selectedItem.list;

                setTimeout(function() {

                    self.setupSwiper()
                }, 200)


            }

            for (var i = 0; i < e.originalEvent.dataTransfer.files.length; ++i) {

                var path = e.originalEvent.dataTransfer.files[i].path;

                path = path.replace(/\\/g, '\\\\');
                path = '"' + path + '"';
                list.push(path)
            }
           
           self.save();

           self.$message({
                     message: `添加成功, 共${e.originalEvent.dataTransfer.files.length}张`,
                     type: 'success'
                   });

        })



        // holder.ondrop = function (e) {

        //     e.preventDefault();



        //     for (var i = 0; i < e.dataTransfer.files.length; ++i) {

        //         h5.textContent+=e.dataTransfer.files[i].path;

        //         self.list.push(e.dataTransfer.files[i].path)

        //     }


        //     self.save();

        //     return false;

        // };
    },

    methods: {
        onAddAlbum: function() {
            this.dialogVisible = true;
        },

        onAddAlbumComplete: function() {

            if (this.isEditAlbum) {

                this.curEditItem.name = this.albumTitle;

                this.isEditAlbum = false;

            } else {

                var newAlbum = {
                    name: this.albumTitle,
                    date: new Date(),
                    list: []
                }
                this.DATA.albums.push(newAlbum);
            }


            this.save()

            this.dialogVisible = false;
        },
        onDeletePic: function(i) {

            var _this = this;
            
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                        _this.selectedItem.list.splice(i, 1);

                        _this.save();

                        _this.$message({
                                  message: `删除成功`,
                                  type: 'success'
                                });
                    }).catch(() => {
                      _this.$message({
                        type: 'info',
                        message: '已取消删除'
                      });          
                    });
           
        },
        onDeleteAlbum: function(i,e) {

            var _this = this;

            e.stopPropagation()
            // alert(i)
            this.$confirm('确认删除相册吗', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                        _this.DATA.albums.splice(i, 1)

                        _this.save();

                        _this.$message({
                                  message: `删除成功`,
                                  type: 'success'
                                });
                    }).catch(() => {
                      _this.$message({
                        type: 'info',
                        message: '已取消删除'
                      });          
                    });
           
        },
        onEditAlbum: function(album,e) {

            var _this = this;

            this.isEditAlbum = true;

            this.curEditItem = album;

            this.dialogVisible = true;

            this.albumTitle = album.name;
            e.stopPropagation()
            // alert(i)
           
           
        },
        onAlbumClick: function(item) {

            var self = this;
            this.selectedItem = item;


            for (var i = 0; i < this.selectedItem.list.length; i++) {
                if (this.selectedItem.list[i].indexOf('\\\\') == -1)
                this.selectedItem.list[i] = this.selectedItem.list[i].replace(/\\/g, '\\\\');
                if (this.selectedItem.list[i][0] != '"')
                this.selectedItem.list[i] = '"' + this.selectedItem.list[i].replace(/\\/g, '\\\\') + '"';
            }

            setTimeout(function() {
                self.setupSwiper()

            }, 0)

            this.activeName = 'second'
        },
        save: function() {

            localStorage.setItem('DATA', JSON.stringify(this.DATA))
        },

        setupSwiper:function() {
            if (window.galleryThumbs) {
                window.galleryThumbs.destroy()
            }
            if (window.galleryTop) {
                window.galleryTop.destroy()
            }
            window.galleryThumbs = new Swiper('.gallery-thumbs', {
                spaceBetween: 10,
                slidesPerView: 4,
                freeMode: true,
                watchSlidesVisibility: true,
                watchSlidesProgress: true,
            });
            window.galleryTop = new Swiper('.gallery-top', {
                spaceBetween: 10,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                thumbs: {
                    swiper: galleryThumbs
                }
            });
        }
    }
})