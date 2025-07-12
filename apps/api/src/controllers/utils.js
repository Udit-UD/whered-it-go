import _ from 'lodash';

export const findTopCategory = transactions => {
  if (!transactions || transactions.length === 0) {
    return null;
  }

  const grouped = _.groupBy(transactions, 'categoryId');

  const categorySums = _.mapValues(grouped, txns => _.sumBy(txns, 'amount'));

  const topCategoryId = _.maxBy(Object.keys(categorySums), key => categorySums[key]);

  return topCategoryId;
};
