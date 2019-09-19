desc "Deploy"
task :deploy do

    puts 'do build'

    # build folder
    system "rm -rf build"
    system "mkdir build"

    # git
    Dir.chdir("build") do
        system "git init ."
        system "git remote add origin git@github.com:nazz-linden/nazz-linden.github.io.git"
        system "git checkout --orphan master"
    end
    # do build
    system "bundle exec middleman build"

    # push build
    Dir.chdir("build") do
        system "git add -A"
        system "git commit -m build"
        system "git push -uf origin master"
    end
end
