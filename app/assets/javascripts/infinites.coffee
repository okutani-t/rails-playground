$ ->
  $("#posts .page").infiniteScroll
    hideNav: "nav.pagination"
    path: "nav.pagination a[rel=next]"
    append: "#posts tr.post"
    status: '.page-load-status'
    history: false