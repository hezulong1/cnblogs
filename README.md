# cnblogs

这是一款[博客园](https://www.cnblogs.com/)的博客皮肤。

**仍然在制作当中...**

鄙人称此皮肤为 `pure`，主打清新自然。

> 这是一个测试表现的网站：[https://accessible-colors.com/](https://accessible-colors.com/)


## 字号

字号上因为是作为一份技术博客使用，所以我想让网站看起啦更像一本书籍。

- <span style="font-size: 18px">标题字号: 18px</span>

- <span style="font-size: 14px">常规字号: 14px</span>

- <span style="font-size: 12px">辅助字号: 12px</span>

以上在整体网站使用。

---

文章中的字号将分 6 个等级，即 

- <span style="font-size: 22px">`h1`: 22px</span>

- <span style="font-size: 18px">`h2`: 18px</span>

- <span style="font-size: 16px">`h3`: 16px</span>

- <span style="font-size: 14px">`h4`: 14px</span>

- <span style="font-size: 13px">`h5`: 13px</span>

- <span style="font-size: 12px">`h6`: 12px</span>

## 色彩

如果你恰巧会一些 `scss` ，那么你可以选择重新制作一些配置。只要修改 `src/base/_var.scss` 文件的配色即可。

其中 `$color-primary` 是全局主题色，其它的色彩都是辅助色


## 小问题

- 打开广告
 
  请将 `src/partials/_main-body-ad.scss` 中的第 22 行注释或者删除。

- 记录信息
 
  请将 `src/partials/_header.scss` 中的第 97 行注释或者删除。
