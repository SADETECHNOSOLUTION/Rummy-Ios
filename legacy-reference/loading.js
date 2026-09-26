import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Bar as ProgressBar } from 'react-native-progress';

const LoadingScreen = ({ loadingTime = 5000 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (progress < 1) {
      interval = setInterval(() => {
        setProgress((prevProgress) => Math.min(prevProgress + 0.01, 1)); // Increment the progress by 1% every interval
      }, loadingTime / 100); // Adjust interval to complete the progress in the specified time
    }

    return () => clearInterval(interval);
  }, [progress, loadingTime]);

  return (
    <View style={styles.loadingcontainer}>

      <Text style={styles.text}>
        {progress === 1 ? null :       <ProgressBar
        progress={progress}
        width={300} // Customize the width of the bar
        height={10} // Customize the height of the bar
        color="#621B98" // Customize the color of the progress bar
      />}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
