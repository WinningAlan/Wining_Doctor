 <template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="Title" label="标题"></el-table-column>
    <el-table-column show-overflow-tooltip prop="Content" label="内容"></el-table-column>
    <el-table-column prop="FromUser" label="来源"></el-table-column>
    <el-table-column prop="Status" label="状态">
      <template slot-scope="scope">
        <p :style="{color:scope.row.Status===1?'#1989fa':'#ccc'}">{{scope.row.Status | msgStatus }}</p>
      </template>
    </el-table-column>
    <el-table-column prop="CreateTime" label="创建时间">
      <template slot-scope="scope">
        <p>{{scope.row.CreateTime | timeFilter }}</p>
      </template>
    </el-table-column>
  </el-table>
</template>
  <script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    },
  }
};
</script>