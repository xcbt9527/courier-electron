<template>
  <el-dialog :modal="true" :visible.sync="showDialog" @before-close="handleCancel" title="导入">
    <input
      @change="importfxx(this)"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      id="upload"
      style="display:none;"
      type="file"
    />
    <el-button @click="upload" type="danger">导入数据</el-button>
    <template v-if="list.length>0">
      <div class="infinite-list-wrapper" style="overflow:auto;height:300px;">
        <ul class="list" infinite-scroll-disabled="disabled" v-infinite-scroll="load">
          <li :key="index" class="list" v-for="(item,index) in list">
            <span :key="value" v-for="(key,value) in item">{{value}}:{{key}}</span>
          </li>
        </ul>
      </div>
    </template>
    <div class="dialog-footer" slot="footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button @click="handleConfirm" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>
<style lang="scss">
.list {
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  span {
    margin: 10px;
    box-sizing: border-box;
  }
}
</style>
<script>
export default {
  data() {
    return {
      list: [],
      count: 2,
      name: "",
      loading: ""
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("update:show", val);
        this.$emit("cancel");
      }
    }
  },
  watch: {
    showDialog(val) {
      if (val) {
        this.list = [];
        document.getElementById("upload")
          ? (document.getElementById("upload").value = "")
          : "";
        this.name = "";
      }
    },
    list(val) {
      if (val.length > 0) {
        this.loading.close();
      }
    },
    loading(val) {
      setTimeout(() => {
        this.loading.close();
      }, 3000);
    }
  },
  methods: {
    load() {
      setTimeout(() => {
        this.count += 2;
      }, 2000);
    },
    handleCancel() {
      this.showDialog = false;
    },
    handleConfirm() {
      this.showDialog = false;
      this.$emit("confirm", { name: this.name, list: this.list });
    },
    upload() {
      document.getElementById("upload").click();
      this.loading = this.$loading({
        lock: true,
        text: "检查数据中，请稍等···",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    importfxx(obj) {
      let _this = this;
      let inputDOM = this.$refs.inputer; // 通过DOM取文件数据
      this.file = event.currentTarget.files[0];
      var rABS = false; //是否将文件读取为二进制字符串
      var f = this.file;
      _this.name = this.file.name.replace(/(.*\/)*([^.]+).*/gi, "$2");
      var reader = new FileReader(); //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = "";

        var rABS = false; //是否将文件读取为二进制字符串

        var pt = this;

        var wb; //读取完成的数据

        var outdata;

        var reader = new FileReader();

        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result);

          var length = bytes.byteLength;

          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require("xlsx");

          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化

              type: "base64"
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary"
            });
          }

          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
          _this.list = outdata;

          setTimeout(() => {
            _this.$notify.success({
              title: "成功",
              message: "解析成功，请点击确认，确认本次数据是否正确"
            });
          }, 100);
        };

        reader.readAsArrayBuffer(f);
      };

      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    }
  }
};
</script>
