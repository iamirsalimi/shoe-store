let apiData = {
    // users api data
    getUsersUrl : "https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/UsersTable?select=*",
    getUsersApiKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY",

    updateUsersUrl : 'https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/UsersTable?some_column=eq.',
    updateUsersApiKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY',

    deleteUsersUrl : 'https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/UsersTable?some_column=eq.',
    deleteUsersApiKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY',

    postUsersUrl : 'https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/UsersTable',
    postUsersApiData : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY',
    
    // products api data
    getProductsUrl : "https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/Products?select=*",
    getProductsApiKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY",
    
    updateProductsUrl : 'https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/Products?some_column=eq.',
    updateProductsApiKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY',

    deleteProductsUrl : 'https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/Products?some_column=eq.',
    deleteProductsApiKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY',
    
    postProductsUrl : 'https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/Products',
    postProductsApiData : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY',
    
    // purchases
    getPurchasesUrl : "https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/PurchasesTable?select=*",
    getPurchasesApiKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY",
    
    postPurchasesUrl : 'https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/PurchasesTable',
    postPurchasesApiData : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY',

    authorization : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY'
}

export default apiData