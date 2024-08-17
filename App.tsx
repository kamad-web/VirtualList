import React, {useEffect, useReducer} from 'react';
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const initialState = {
  items: [],
  loading: false,
  page: 1,
  hasMore: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_MORE':
      return {
        ...state,
        loading: true,
      };
    case 'LOAD_SUCCESS':
      return {
        ...state,
        items: [...state.items, ...action.payload],
        loading: false,
        page: state.page + 1,
        hasMore: action.payload.length > 0,
      };
    case 'LOAD_FAILURE':
      return {
        ...state,
        loading: false,
        hasMore: false,
      };
    default:
      return state;
  }
};

const Item = ({index}: {index: number}) => (
  <View style={styles.item}>
    <Text style={styles.itemText}>Item {index + 1}</Text>
  </View>
);

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchMoreData();
  }, []);

  const fetchMoreData = () => {
    if (state.loading || !state.hasMore) return;

    dispatch({type: 'LOAD_MORE'});

    // Simulate fetching data from an API
    setTimeout(() => {
      const newItems = Array.from({length: 20}, (_, index) => ({
        id: `${state.page * 20 + index}`,
      }));
      dispatch({type: 'LOAD_SUCCESS', payload: newItems});
    }, 1500);
  };

  const renderFooter = () => {
    if (!state.loading) return null;
    return <ActivityIndicator style={styles.loadingIndicator} />;
  };

  return (
    <FlatList
      data={state.items}
      renderItem={({item, index}) => <Item index={index} />}
      keyExtractor={item => item.id}
      onEndReached={fetchMoreData}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      initialNumToRender={10}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={11}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemText: {
    fontSize: 15,
  },
  loadingIndicator: {
    marginVertical: 2,
  },
});
export default App;
