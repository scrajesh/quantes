require 'test_helper'

class MactabsControllerTest < ActionController::TestCase
  setup do
    @mactab = mactabs(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:mactabs)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create mactab" do
    assert_difference('Mactab.count') do
      post :create, mactab: {  }
    end

    assert_redirected_to mactab_path(assigns(:mactab))
  end

  test "should show mactab" do
    get :show, id: @mactab
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @mactab
    assert_response :success
  end

  test "should update mactab" do
    put :update, id: @mactab, mactab: {  }
    assert_redirected_to mactab_path(assigns(:mactab))
  end

  test "should destroy mactab" do
    assert_difference('Mactab.count', -1) do
      delete :destroy, id: @mactab
    end

    assert_redirected_to mactabs_path
  end
end
