
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

const FILE_FOLDERS = __dirname + '/config/folders.json';
const FILE_FILES = __dirname + '/config/files.json';

new Vue({
    el: '#app',
    data() {
        return {
            folderList: [],
            fileList: [],

            haveFiles: [], // 已有文件列表
            randomFile: '',
            randomFileSrc: '',
            imgIndex: '',
            basename: '',
            imgWidth: 0,
            imgHeight: 0,
        }
    },
    computed: {
        totalCount() {
            return this.fileList.length;
        }
    },
    mounted() {
        this.folderList = require(FILE_FOLDERS);
        this.haveFiles = require(FILE_FILES);

        this.random();
    },
    methods: {
        max() {
            ipcRenderer.send('max');
        },
        min() {
            ipcRenderer.send('min');
        },
        close() {
            ipcRenderer.send('close');
        },
        /**
         * 开始搜索
         */
        startSearch() {
            this.fileList = []
            for (let index = 0; index < this.folderList.length; index++) {
                const folder = this.folderList[index];
                
                this.getFiles(folder, {
                    pattern: /(jp(e)?g)$/
                });
            }
        },
        /**
         * 查询目录下的所有文件
         * @param {*} folder 目录
         */
        getFiles(folder, options) {
            options = options || {};

            let list = fs.readdirSync(folder);
            
            for (let index = 0; index < list.length; index++) {
                const file = path.join(folder, list[index]);
                
                let stat = fs.lstatSync(file);

                if (stat.isDirectory()) {
                    this.getFiles(file, options);
                } else {
                    this.fileList.push(file)
                }
            }
        },
        /**
         * 添加一行Input
         */
        addInput() {
            this.folderList.push([]);
        },
        /**
         * 删除一行Input
         */
        removeInput(i) {
            this.folderList.splice(i, 1);
        },
        /**
         * 保存目录和文件列表
         */
        save() {
            fs.writeFileSync(FILE_FOLDERS, JSON.stringify(this.folderList));
            fs.writeFileSync(FILE_FILES, JSON.stringify(this.fileList));
        },
        /**
         * 获得随机文件
         */
        random(i) {
            let index = i || Math.round(Math.random() * (this.haveFiles.length - 1));

            this.imgIndex = index;
            this.randomFile = this.haveFiles[index];
            this.randomFileSrc = this.randomFile.replace(/#/g, '%23')
            this.basename = path.basename(this.randomFile).replace(/%23/g, '#');    
        },
        /**
         * 重命名
         */
        rename() {
            let ext = path.extname(this.randomFile);
            let name = path.basename(this.basename, ext);
            this.$prompt('', '重命名', {
                inputValue: name
            }).then(({ value }) => {
                let dir = path.dirname(this.randomFile);
                let newFile = path.join(dir, value) + ext;

                fs.rename(this.randomFile, newFile, (err) => {
                    if (err) {
                        return;
                    }
                    this.$message({
                        type: 'success',
                        message: '成功',
                    });
                    
                    this.haveFiles[this.imgIndex] = newFile;
                    fs.writeFile(FILE_FILES, JSON.stringify(this.haveFiles), ()=> {

                    });
                    this.randomFile = newFile;
                    this.basename = path.basename(this.randomFile);

                });
            });
        },
        /**
         * 图片加载事件
         */
        onImgLoad() {
            this.imgWidth = this.$refs.elImg.width;
            this.imgHeight = this.$refs.elImg.height;
        }
    }
})