import Constants from './Constants';

class Database {
  constructor() {
    this.database = null;

    this.initiateDb = this.initiateDb.bind(this);
    this.addArticle = this.addArticle.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
    this.getArticles = this.getArticles.bind(this);

    // Create/get DB
    if (window.Promise) {
      this.initiateDb();
    }
  }

  initiateDb() {
    this.database = idb.open(Constants.IDB.DB, 1, (upgradeDb) => {
      if (!upgradeDb.objectStoreNames.contains(Constants.IDB.ARTICLES_STORE)) {
        let articleOS = upgradeDb.createObjectStore(Constants.IDB.ARTICLES_STORE, {
          keyPath: 'link'
        });
        articleOS.createIndex('title', 'title', {unique: false});
        articleOS.createIndex('link', 'link', {unique: true});
        articleOS.createIndex('description', 'description', {unique: false});
        articleOS.createIndex('categoryName', 'categoryName', {unique: false});
        articleOS.createIndex('categoryLink', 'categoryLink', {unique: false});
        articleOS.createIndex('timeToRead', 'timeToRead', {unique: false});
        articleOS.createIndex('imageMobile', 'imageMobile', {unique: false});
        articleOS.createIndex('imageDesktop', 'imageDesktop', {unique: false});
        articleOS.createIndex('isLarge', 'isLarge', {unique: false});
        articleOS.createIndex('isVideo', 'isVideo', {unique: false});
        articleOS.createIndex('cacheName', 'cacheName', {unique: false});
      }
    });
  }

  deleteArticle(link) {
    return this.database.then((db) => {
      let transaction = db.transaction([Constants.IDB.ARTICLES_STORE], 'readwrite');
      let store = transaction.objectStore(Constants.IDB.ARTICLES_STORE);
      return Promise.all([
        store.delete(link),
        transaction.complete
      ]);
    });
  }

  addArticle(title, link, description, categoryName, categoryLink, timeToRead, imageMobile, imageDesktop, isLarge, isVideo, cacheName) {
    return this.database.then((db) => {
      let transaction = db.transaction([Constants.IDB.ARTICLES_STORE], 'readwrite');
      let store = transaction.objectStore(Constants.IDB.ARTICLES_STORE);
      return Promise.all([
        store.add({
          title,
          link,
          description,
          categoryName,
          categoryLink,
          timeToRead,
          imageMobile,
          imageDesktop,
          isLarge,
          isVideo,
          cacheName
        }),
        transaction.complete
      ]);
    });
  }

  getArticles() {
    return this.database.then((db) => {
      let transaction = db.transaction([Constants.IDB.ARTICLES_STORE], 'readonly');
      let store = transaction.objectStore(Constants.IDB.ARTICLES_STORE);
      return store.getAll();
    });
  }
}

export default new Database();
