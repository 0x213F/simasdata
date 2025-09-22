export const getGradientColors = (index: number) => {
  const gradients = [
    'from-blue-100 to-blue-200',
    'from-purple-100 to-purple-200',
    'from-green-100 to-green-200',
    'from-orange-100 to-orange-200',
    'from-pink-100 to-pink-200',
    'from-teal-100 to-teal-200',
    'from-indigo-100 to-indigo-200',
    'from-red-100 to-red-200',
  ];
  return gradients[index % gradients.length];
};