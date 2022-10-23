Insert a calendar like Github contributions into your blog.

[中文文档](https://github.com/HCLonely/hexo-calendar/blob/master/README_CN.md)

> Note: This plugin will conflict with the `hexo g` command, please use `hexo ge` or `hexo generate` instead of the `hexo g` command!

## Precondition

> Note: The plugin cannot be used if the prerequisites are not met, and the problems of installing this plugin when the prerequisites are not met will not be dealt with, and how to achieve the following prerequisites will not be dealt with!

1. Node.js >= 12.0
2. Use [Git](https://git-scm.com/) to manage the blog **source code**.
3. Use the `git log -1 --date=iso --pretty=format:"%ad"` command in the blog root directory to output a date.
4. How to determine whether the first item meets:
    1. The blog root directory contains the `.git` folder, which is a hidden folder.
    2. Meets the third item above.

## Installation

```shell
npm i hexo-calendar -S
```
or
```shell
cnpm i hexo-calendar -S
```

## Usage

### Use as a helper function in theme templates

```ejs
<%- calendar({monthLang: 'en', dayLang: 'en', title: 'calendar'}) %>
```

### Use as a tag in md files

> Note: Please use strict JSON format for this method!

```nunjucks
{% calendar %}
{"monthLang": "en", "dayLang": "en", "title": "calendar"}
{% endcalendar %}
```

### If you use automatic deployment

If you use automatic deployment such as `Travis CI`, `Github Action`, then you need to use the `hexo gc -w=40` command to generate a `calendar.json` file before pushing the source code. `-w=40` means to display activity records from 40 weeks ago to the present.

## Options

| Name | Type | Default value | Description |
| :-----: | :-----: | :-----: | :-----: |
| width | `String` | `"600"` | Calendar width, unit: `px` |
| height | `String` | `"185"` | Calendar height, unit: `px` |
| id | `String` | `"calendar"` | Calendar element id |
| monthLang | `String` or `Array` | `"en"` | Month language, optional: `en`, `cn` or [custom](https://echarts.apache.org/en/option.html#calendar.monthLabel.nameMap) |
| dayLang | `String` or `Array` | `"en"` | Language for every day of the week, optional: `en`, `cn` or [custom](https://echarts.apache.org/en/option.html#calendar.dayLabel.nameMap) |
| weeks | `Number` | `40` | Show how many weeks ago to the present activity record |
| title | `String` | `"calendar"` | Calendar title |
| insertScript | `Boolean` | `true` | Whether to automatically insert the `echarts` library. If you have imported the `echarts` library globally, please set this to `false`; if your site has `pjax` enabled, please set this to `false` and reference the `echarts` library globally. |
| color | `Object` | `null` | Color options |
| color.background | `String` | `"#f9f9f9"` | Background color |
| color.tooltip.background | `String` | `"#555"` | Tooltip's background color |
| color.tooltip.border | `String` | `"#777"` | Tooltip's border color |
| color.visualMap.inRange | `String` | `'["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"]'` | The colors displayed for different times of submission |
| color.calendar.itemBorder | `String` | `"#fff"` | The border color for each data point |
| color.calendar.monthLabel | `String` | `"#3C4858"` | Month label color |
| color.calendar.dayLabel | `String` | `"#3C4858"` | Day label color |
| color.calendar.name | `String` | `"#3C4858"` | None |

## Example

![Example](https://cdn.jsdelivr.net/gh/HCLonely/hexo-calendar@latest/example.png)
