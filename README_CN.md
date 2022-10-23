在博客中插入类似 Github contributions 的活动日历。

> 注意：此插件会和`hexo g`命令冲突，请使用`hexo ge`或`hexo generate`替代`hexo g`命令！

## 前提条件

> 注意：不满足前提条件的无法使用此插件，在不满足前提条件的情况下安装此插件出现的问题不予以处理，如何实现以下前提条件的问题不予以处理！

1. Node.js >= 12.0
2. 使用[Git](https://git-scm.com/)对博客**源码（不是使用 git 部署）**进行管理；
3. 在博客根目录使用`git log -1 --date=iso --pretty=format:"%ad"`命令能够输出一个日期；
4. 如何确定第一项是否符合：
    1. 博客根目录含有`.git`文件夹，这是一个隐藏文件夹；
    2. 符合上面的第三项。

## 安装

```shell
npm i hexo-calendar -S
```
or
```shell
cnpm i hexo-calendar -S
```

## 使用

### 作为辅助函数在主题模板中使用

```ejs
<%- calendar({monthLang: 'cn', dayLang: 'cn', title: '活动日历'}) %>
```

### 作为标签在 md 文件中使用

> 注意：这种方法请使用严格的 JSON 格式！

```nunjucks
{% calendar %}
{"monthLang": "cn", "dayLang": "cn", "title": "活动日历"}
{% endcalendar %}
```

### 如果你使用了自动部署

如果你使用了`Travis CI`, `Github Action`之类的自动部署，那么你需要在推送源码之前使用`hexo gc -w=40`命令生成一个`calendar.json`文件。`-w=40`代表显示 40 周之前至今的活动记录。

## 选项

| 名称 | 类型 | 默认值 | 描述 |
| :-----: | :-----: | :-----: | :-----: |
| width | `String` | `"600"` | 日历宽度，单位：`px` |
| height | `String` | `"185"` | 日历高度，单位：`px` |
| id | `String` | `"calendar"` | 日历元素 id |
| monthLang | `String` or `Array` | `"en"` | 月份语言，可选：`en`, `cn`或[自定义](https://echarts.apache.org/zh/option.html#calendar.monthLabel.nameMap) |
| dayLang | `String` or `Array` | `"en"` | 一周中每一天的语言，可选：`en`, `cn`或[自定义](https://echarts.apache.org/zh/option.html#calendar.dayLabel.nameMap) |
| weeks | `Number` | `40` | 显示多少周之前至今的活动记录 |
| title | `String` | `"calendar"` | 日历标题 |
| insertScript | `Boolean` | `true` | 是否自动插入`echarts`库。如果你已全局引入`echarts`库，请将此项设为`false`；如果你的站点启用了`pjax`，请将此项设为`false`，并全局引用`echarts`库。 |
| color | `Object` | `null` | 颜色选项 |
| color.background | `String` | `"#f9f9f9"` | 背景颜色 |
| color.tooltip.background | `String` | `"#555"` | 提示框背景颜色 |
| color.tooltip.border | `String` | `"#777"` | 提示框边框颜色 |
| color.visualMap.inRange | `String` | `'["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"]'` | 不同提交次数显示的颜色 |
| color.calendar.itemBorder | `String` | `"#fff"` | 每个数据点的边框颜色 |
| color.calendar.monthLabel | `String` | `"#3C4858"` | 月份颜色 |
| color.calendar.dayLabel | `String` | `"#3C4858"` | 日期颜色 |
| color.calendar.name | `String` | `"#3C4858"` | 无 |

## 示例

![示例](https://cdn.jsdelivr.net/gh/HCLonely/hexo-calendar@latest/example.png)
